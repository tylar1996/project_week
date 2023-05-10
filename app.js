const express = require("express");
const app = express();
const apiRouter = require("./routers/api_router");
const PORT = process.env.PORT || 9090;

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(400).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}.`);
// });

module.exports = app;
