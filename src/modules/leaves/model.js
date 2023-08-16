const mongoose = require("mongoose");

const leaveTypesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  quota: {
    type: Number,
    required: true,
  },
  creditInterval: {
    type: String,
    enum: {
      values: ["quaterly", "half-yearly", "yearly"],
      message: "credit interval must be quaterly, half-yearly or yearly",
    },
    default: "quaterly",
  },
  lapsedCondition: {
    type: String,
    enum: {
      values: ["all-leaves", "carried-forward"],
      message: "lapsed condition must be all-leaves or carried-forward",
    },
    default: "all-leaves",
  },
  carryForward: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "status must be active or inactive",
    },
    default: "active",
  }
 },
 {
   timestamps: true
 }
);

module.exports = mongoose.model("LeaveType", leaveTypesSchema);
