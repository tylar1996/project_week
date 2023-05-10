const { readApi } = require("../models/api_model");

exports.getApi = (req, res, next) => {
  readAPI()
    .then((api) => {
      res.status(200).send(api);
    })
    .catch(next);
};
