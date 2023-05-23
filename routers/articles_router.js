const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("../controllers/articles_controller");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
