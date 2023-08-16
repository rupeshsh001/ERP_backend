const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  startDate: {
    type: Date,
    required: false,
  },

  endDate: {
    type: Date,
    required: false,
  },

  type: {
    type: String,
    required: true,
  },

  restDays: {
    type: Array,
    required: false,
  },

  holidayType: {
    type: String,
    enum: ["Public Holiday", "Festival"],
    default: "Public Holiday",
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  }
 },
 {
   timestamps: true
 }
);

module.exports = mongoose.model("holiday", holidaySchema);
