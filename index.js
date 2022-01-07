require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoute = require("./routes/auth");
const requestRoute = require("./routes/request");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const todoRoute = require("./routes/todo");

app.use(express.json());

app.use("/auth", authRoute);
app.use("/request", requestRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);
app.use("/todos", todoRoute);

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
