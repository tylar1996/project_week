const express = require("express");
const articlesRouter = express.Router();
const {
  getArticlesById,
  getArticles,
} = require("../controllers/articles_controller");

articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
