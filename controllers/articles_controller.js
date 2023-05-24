const {
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  postCommentModel,
  patchArticleModel,
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

exports.postComment = (req, res, next) => {
  article_id = req.params.article_id;
  body = req.body;
  postCommentModel(article_id, body)
    .then((comment) => {
      res.status(201).send({
        comment: comment,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  article_id = req.params.article_id;
  body = req.body;
  patchArticleModel(article_id, body)
    .then((patch) => {
      res.status(200).send({
        patch: patch,
      });
    })
    .catch((err) => {
      // console.log(err)
      next(err);
    });
};
