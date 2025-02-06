import express from "express";
import cors from "cors";
import { createRequire } from "module";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();
const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3000;

puppeteer.use(StealthPlugin());

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request body
const TIMEOUT = 30000;

// Define the clickButton function
const clickButton = async (page, selector) => {
  const button = await page.$(selector);
  if (button) {
    await button.click();
  } else {
    console.log(chalk.red(`Button with selector "${selector}" not found.`));
  }
};

// Puppeteer Function
const scrapeZepto = async (location, product) => {
  // If location is a string, convert it into an object with a city property
  const loc = typeof location === "string" ? { city: location } : location;

  console.log(chalk.blue(`Starting Puppeteer for: ${loc.city}, ${product}`));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    console.log(chalk.blue("Navigating to Zepto..."));
    await page.goto("https://www.zeptonow.com/", {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT,
    });

    console.log(chalk.green(`Page Title: ${await page.title()}`));
    await page.waitForSelector('button[aria-label="Select Location"]', { visible: true, timeout: TIMEOUT });
    await clickButton(page, 'button[aria-label="Select Location"]');

    await page.waitForSelector('input[placeholder="Search a new address"]', {
      visible: true,
      timeout: TIMEOUT,
    });

    console.log(chalk.blue(`Entering city: ${loc.city}`));
    await page.type(
      'input[placeholder="Search a new address"]',
      loc.city,
      { delay: 100 }
    );

    await page.waitForSelector('div[data-testid="address-search-item"]', {
      visible: true,
      timeout: TIMEOUT,
    });

    await page.click('div[data-testid="address-search-item"]');
    console.log(chalk.blue("Selected address from dropdown."));

    await page.waitForSelector('button[data-testid="location-confirm-btn"]', {
      visible: true,
      timeout: TIMEOUT,
    });
    await page.click('button[data-testid="location-confirm-btn"]');
    console.log(chalk.blue("Confirmed location!"));

    // Search for the product
    await page.waitForSelector(
      'div.inline-block.flex-1 a[data-testid="search-bar-icon"]',
      {
        visible: true,
        timeout: TIMEOUT,
      }
    );
    await page.evaluate(() =>
      document
        .querySelector(
          'div.inline-block.flex-1 a[data-testid="search-bar-icon"]'
        )
        .click()
    );
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.waitForSelector(
      'input[placeholder="Search for over 5000 products"]',
      { visible: true, timeout: TIMEOUT }
    );
    await page.type(
      'input[placeholder="Search for over 5000 products"]',
      product,
      { delay: 100 }
    );
    await page.keyboard.press("Enter");
    console.log(chalk.blue(`Searching for product: ${product}`));

    console.log(chalk.yellow("Waiting for product results..."));
    const productSelector = '[data-testid="product-card"]';
    const productAvailable = await page
      .waitForSelector(productSelector, { visible: true, timeout: 15000 })
      .catch(() => null);

    if (!productAvailable) {
      console.log(
        chalk.red(
          `❌ Product "${product}" is NOT available currently.`
        )
      );
    } else {
      console.log(
        chalk.green(
          `✅ Product "${product}" is available. Extracting details...`
        )
      );
      const products = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('[data-testid="product-card"]')
        ).map((product) => ({
          name:
            product
              .querySelector('[data-testid="product-card-name"]')
              ?.innerText.trim() || "N/A",
          price:
            product
              .querySelector('[data-testid="product-card-price"]')
              ?.innerText.trim() || "N/A",
          quantity:
            product
              .querySelector('[data-testid="product-card-quantity"] h4')
              ?.innerText.trim() || "N/A",
        }));
      });
      console.log(chalk.green("Extracted product details:"));
      console.table(products);
    }

    // Clicking and checking availability for the first product
    const firstProduct = await page.$('a[data-testid="product-card"]');
    if (firstProduct) {
      await page.evaluate(() =>
        document.querySelector('a[data-testid="product-card"]').click()
      );
      await page.waitForNavigation({ waitUntil: "load", timeout: 10000 });
      await page.reload({ waitUntil: "domcontentloaded" });

      const addToCartButton = await page.$(
        'button[aria-label="Increase quantity by 1"]'
      );
      if (addToCartButton) {
        const isVisible = await page.evaluate((button) => {
          const style = window.getComputedStyle(button);
          return style.opacity !== "0" && !button.disabled;
        }, addToCartButton);

        if (isVisible) {
          await page.evaluate(() =>
            document
              .querySelector('button[aria-label="Increase quantity by 1"]')
              .click()
          );
          console.log(
            chalk.green(`Product "${product}" is available`)
          );
        } else {
          console.log(
            chalk.red(`Product "${product}" is currently unavailable`)
          );
        }
      } else {
        console.log(
          chalk.red(`Product "${product}" is currently unavailable`)
        );
      }
    } else {
      console.log(chalk.red(`Product "${product}" not found.`));
    }
  } catch (error) {
    console.error(
      chalk.bgRed.white("An error occurred in the main flow:"),
      error
    );
  } finally {
    console.log(chalk.magenta("Closing browser..."));
    await browser.close();
  }
};

// API Endpoint
app.post("/search", async (req, res) => {
  const { location, product } = req.body;

  if (!location || !product) {
    return res
      .status(400)
      .json({ success: false, error: "Location and product are required!" });
  }

  console.log(
    chalk.yellow(
      `Received request: Location - ${location}, Product - ${product}`
    )
  );

  const result = await scrapeZepto(location, product);
  res.json(result);
});

// Start Server
const server = app.listen(0, () => {
  const port = server.address().port;
  console.log(chalk.green(`Server is running on http://localhost:${port}`));
});
