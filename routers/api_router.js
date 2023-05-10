const express = require("express");
const { getApi } = require("../controllers/api_controller");
const apiRouter = express.Router();
// const articlesRouter = require("./articles_router");
const topicsRouter = require("./topics_router");
// const commentsRouter = require("./comments_router");
// const usersRouter = require("./users_router");

apiRouter.get("/", getApi);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
