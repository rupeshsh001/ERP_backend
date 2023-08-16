const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchase_ordertests",
      required: [true, "User-ID is required"],
    },
    clientSponsor: {
      type: String,
      required: [true, "client sponsor is required"],
    },
    clientFinanceController: {
      type: String,
      required: [true, "client finance controller is required"],
    },
    invoiceRaised: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    status: {
      type: String,
      enum: ["Overdue", "Invoice raised", "Complete", "Draft"],
      required: [true, "status is required"],
      default: "Draft",
    },
    invoiceRaisedOn: {
      type: Date,
      default: null,
    },
    invoiceReceived: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    invoiceAmountReceived: {
      type: Number,
      default: null,
    },
    vbBankAccount: {
      type: String,
      default: null,
    },
    amountReceivedOn: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
