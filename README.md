🛒 Zepto Product Checker 
A Node.js service using Puppeteer to automate product availability checks on Zepto, based on location and product name. It simulates browser actions, scrapes product details, and returns availability status in JSON format.

Zepto Product Availability Checker – A Node.js service that automates product searches on Zepto using Puppeteer. Enter a location and product name, and get availability details instantly. 

🔹 Built with: Express, Puppeteer, Chalk, and dotenv. 
🔹 Automates location selection and product search. 
🔹 Fetches real-time product availability.

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
