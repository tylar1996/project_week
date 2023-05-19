const fs = require("fs/promises");

exports.readApi = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, `utf-8`)
    .then((result) => {
      return result;
    });
};
