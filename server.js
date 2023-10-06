const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 4002;
dotenv.config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log("Something went wrong:", error));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.port}!`)
);
