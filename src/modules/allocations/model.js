const mongoose = require("mongoose");
const projectSchema = require("./../projects/model");
const { Employee } = require("./../employee/model");

const projectAndEmployee = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: projectSchema,
    },
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee,
    },
    empPrimaryCapability: {
      type: Array,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    percentage: {
      type: Number,
    },
    rackRate: {
      type: Number,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("allocations", projectAndEmployee);
