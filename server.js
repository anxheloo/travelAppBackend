const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 4002;
dotenv.config();
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandling");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

// This is a custom middleware we created, before our http req,res, we run our next() function
// app.use((req, res, next) => {
//   console.log("Middleware called!");
//   next();
// });
// app.use(express.json()) -> this acts like a middleware to accepts json files between frontend and backend

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log("Something went wrong:", error));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(errorHandler);
app.use("/api/", authRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.port}!`)
);
