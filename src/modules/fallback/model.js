const mongoose = require("mongoose");

const fallBackSchema = new mongoose.Schema(
  {
    time: {
      type: Number,
    },
  },
  { timestamps: true }
);

const fallBackModel = mongoose.model("fallBackTime", fallBackSchema);

module.exports = { fallBackModel };
