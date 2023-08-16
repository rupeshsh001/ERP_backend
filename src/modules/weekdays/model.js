const mongoose = require("mongoose");

const weeksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  holiday: {
    type: Boolean,
    default: false,
  },
});

const weekConfiguratorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  weeks: {
    type: [weeksSchema],
    required: true,
  }
 },
{
   timestamps: true
 }
);

const WeekHoliday = mongoose.model("week-holiday", weekConfiguratorSchema);

module.exports = { WeekHoliday };
