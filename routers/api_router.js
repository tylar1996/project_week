const express = require("express");
const { getApi } = require("../controllers/api_controller");
const apiRouter = express.Router();
const articlesRouter = require("./articles_router");
const topicsRouter = require("./topics_router");

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
