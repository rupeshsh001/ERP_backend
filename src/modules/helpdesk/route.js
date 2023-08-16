//importing packages
const express = require("express");
const helpDeskRouter = express.Router();
const { hasPermission } = require("../../middleware/auth");

//importing from controller
const { createQuestionAndAnswer, getQnAs } = require("./controller");

helpDeskRouter.post("/", createQuestionAndAnswer);
helpDeskRouter.get("/", getQnAs);

module.exports = helpDeskRouter;
