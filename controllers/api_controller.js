const { readApi } = require("../models/api_model");

exports.getApi = (req, res, next) => {
  readApi()
    .then((api) => {
      const parsedResult = JSON.parse(api);

      res.status(200).send(parsedResult);
    })
    .catch(next);
};
