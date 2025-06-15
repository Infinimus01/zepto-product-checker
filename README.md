🛒 Zepto Product Checker 

A Node.js service using Puppeteer to automate product availability checks on Zepto, based on location and product name. It simulates browser actions, scrapes product details, and returns availability status in JSON format.

Highlights : 


✅ Automates location selection and product search
✅ Retrieves live product availability and pricing
✅ Instantly fetches data via a simple API call


🛠️ Tech Stack :

✅ Express.js – API routing
✅ Puppeteer – Headless browser automation
✅ Chalk – Colored logging
✅ dotenv – Environment configuration

⚙️ Requirements

✅ Node.js v16+
✅npm
✅Google Chrome (installed)

⚙️ Setup

npm install
npm start

⚙️ API Usage
Endpoint:
POST http://localhost:<port>/search

⚙️ Request Body:

json :
{
  "location": "560102",
  "product": "chocolates"
}


Response:

json :
{
  "product": "Dairy Milk",
  "price": "₹45",
  "availability": true,
  ...
}


🧠 Note : 
Initial build for checking real-time product availability on Zepto using headless browser automation.
