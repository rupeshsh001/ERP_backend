const mongoose = require("mongoose");

const dropdownField = new mongoose.Schema({
  label: {
    type: String,
    trim: true,
  },
  value: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const dropdownSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A dropdown must have a name"],
      unique: true,
    },
    fields: {
      type: [dropdownField],
      default: [],
    },
  },
  { timestamps: true }
);

//Employee model class
const Dropdown = mongoose.model("Dropdown", dropdownSchema);

module.exports = { Dropdown };
