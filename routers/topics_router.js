const express = require("express");
const { getTopics } = require("../controllers/topics_controller");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);
module.exports = topicsRouter;
