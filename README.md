<<<<<<< HEAD
# zepto-product-checker
A Node.js service using Puppeteer to check product availability on Zepto based on location and product name. It automates interactions with the Zepto website, extracts product details, and returns availability status.
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
