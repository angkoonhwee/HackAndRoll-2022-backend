const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const app = express();
const server = http.createServer(app);

const CLIENT_URL = '';

mongoose.set("useCreateIndex", true);

app.use(express.json);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    process.env.MONGO_URI,
    //"mongodb://localhost:27017/testDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() =>
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((err) => console.log(`${err} did not connect`));
