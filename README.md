<<<<<<< HEAD
# zepto-product-checker
🚀 Zepto Product Availability Checker – A Node.js service that automates product searches on Zepto using Puppeteer. Enter a location and product name, and get availability details instantly! 🛒✨  🔹 Built with: Express, Puppeteer, Chalk, and dotenv 🔹 Automates location selection and product search 🔹 Fetches real-time product availability
=======
# Zepto Product Availability Checker

A Node.js service that checks product availability on Zepto using Puppeteer.

## Requirements

- Node.js v16+
- npm
- Chrome browser installed

## Setup
1. Unzip the package
2. Install dependencies:
   
   npm install

3. npm start

## Make POST requests to POSTMAN:

  http://localhost:<assigned-port>/search
  

## Request body: 
   
{
  "location": "560102",
  "product": "chocolates"
}

## Response : 
Returns JSON with product availability and details.
>>>>>>> Initial commit - Zepto Product Availability Checker
