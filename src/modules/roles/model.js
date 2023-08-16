const mongoose = require("mongoose");

const rolesSchema = mongoose.Schema(
  {
    label: String,
    permissions: Array,
  },
  {
   timestamps: true
  }
);
const rolesModal = mongoose.model("role", rolesSchema);
module.exports = rolesModal;
