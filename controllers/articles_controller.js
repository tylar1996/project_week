const {
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
} = require("../models/articles_model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  readArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  readArticles()
    .then((articles) => {
      res.status(200).send({
        articles,
      });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  readCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  addCommentByArticleId(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
