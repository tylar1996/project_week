const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");

// app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Endpoint" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  }
  if (err.code === "42703") {
    res.status(400).send({ msg: "Invalid patch request" });
  } else next(err);
});

// app.use((err, req, res, next) => {
//   if (err.status === 404) {
//     res.status(404).send({ msg: "Not found" });
//   } else next(err);
// });

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
