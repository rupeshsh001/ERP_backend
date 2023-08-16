const mongoose = require("mongoose");

const compSchema = mongoose.Schema(
  {
    no: { type: Number, required: false },
    legalName: { type: String, required: true },
    brandName: { type: String, unique: true },

    domain: { type: String, required: true },
    gstNumber: { type: String, required: false },
    panNumber: { type: String, required: false },
    companyType: { type: String, required: false },

    registeredAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: false },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      area: { type: String, required: false },
      landmark: { type: String, required: false },
    },
    communicationAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: false },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      area: { type: String, required: false },
      landmark: { type: String, required: false },
    },
    contacts: { type: Object, required: true },
    status: {
      type: Number,
      default: 1,
    },
  },

  {
    timestamps: true,
  }
);
const compModal = mongoose.model("clients", compSchema);
module.exports = compModal;
