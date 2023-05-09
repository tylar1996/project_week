//task3
const express = require("express");
const app = express();
const db = require("./db/connection");
const PORT = process.env.PORT || 9090;
const { getTopics } = require("./controller/controller");

app.get("api/topics", getTopics);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});

module.exports = app;
