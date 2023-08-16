const mongoose = require("mongoose");

//Creating PO/SOW Schema
const purchaseOrderSchema = mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, "Project Id is required"],
    },
    clientName: {
      trim: true,
      type: String,
      required: [true, "client name is required"],
    },
    projectName: {
      trim: true,
      type: String,
      required: [true, "project name is required"],
    },
    clientSponser: {
      type: String,
      required: [true, "client sponser is required"],
    },
    clientFinanceController: {
      type: String,
      required: [true, "client finance controller is required"],
    },
    targettedResources: {
      type: Object,
      required: [true, "targetted Resources is required"],
    },
    targetedResAllocationRate: {
      type: Object,
      required: [true, "targetted Resources is required"],
    },
    Type: {
      type: String,
      enum: ["PO", "SOW"],
      required: [true, "type is required"],
    },
    poNumber: {
      trim: true,
      type: String,
    },
    poAmount: {
      trim: true,
      type: Number,
      required: [true, "po amount is required"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
    },
    documentName: {
      trim: true,
      type: String,
      required: [true, "document name is required"],
    },
    posowEndDate: {
      type: Date,
      required: [true, "enddate is required"],
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Creating purchase order collection with purchase order schema
const purchaseOrderModel = mongoose.model(
  "purchase_order",
  purchaseOrderSchema
);

//exporting collection
module.exports = purchaseOrderModel;
