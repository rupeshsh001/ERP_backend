const mongoose = require("mongoose");

const questionAndAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const helpDeskSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  data: {
    type: [questionAndAnswerSchema],
    default: [],
  },
});

module.exports = mongoose.model("FAQ", helpDeskSchema);
