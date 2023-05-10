const { readTopics } = require("../models/topics_model");

exports.getTopics = (req, res, next) => {
  readTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
