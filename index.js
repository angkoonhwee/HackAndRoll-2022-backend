require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const route = require("express").Router();
const authRoute = require("./routes/auth");

app.use(express.json());

app.use("/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Test Punkt Server");
});

const PORT = process.env.PORT || 8000;

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((err) => console.log(`${err} did not connect`));
