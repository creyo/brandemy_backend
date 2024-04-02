// index.js
const express = require('express');
const serverless = require("serverless-http");
const router = require("./routes/route");
const cors = require("cors");
const app = express();
const port = 3000; // Replace with the desired port number

// Uncomment for additional logging
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
// Use the router for handling routes in Netlify environment
app.use(`/.netlify/functions/index`, router);
  



app.listen(3000, () => {
    console.log(`Express app running on port ${3000}`);
  });
  


// Start the server
module.exports = app;
module.exports.handler = serverless(app);
