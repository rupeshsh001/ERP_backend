const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    vbProjectId: {
      type: String,
      required: false,
    },
    clientId: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPrimaryContactName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    clientProjectManager: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
    clientProjectSponsor: {
      type: String,
      required: true,
    },
    clientFinanceController: {
      type: String,
      required: true,
    },
    clientPrimaryContact: {
      type: Number,
      required: true,
    },
    vbProjectManager: {
      type: String,
      required: false,
    },
    domainSector: {
      type: String,
      required: true,
    },
    vbProjectStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("projectSchema", projectSchema);
