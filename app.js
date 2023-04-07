const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());


//routes
const productRoute = require('./routes/product.route')

app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

//posting to database
app.use("/api/v1/product", productRoute);

module.exports = app;
