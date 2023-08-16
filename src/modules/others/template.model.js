const mongoose = require("mongoose");
const templateSchema = mongoose.Schema(
  {
    temp_Id: String,
    subject: String,
    body: String,
    to: String,
  },
  { collection: "template" }
);

const templateModel = mongoose.model("template", templateSchema);

module.exports = templateModel;
