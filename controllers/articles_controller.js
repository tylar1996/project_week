const { readArticleById, readArticles } = require("../models/articles_model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  readArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  readArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res
        .status(200)
        .send({ articles: articles.rows, total_count: articles.total_count });
    })
    .catch(next);
};
