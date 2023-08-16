const mongoose = require("mongoose");

const addressSchemaRequired = new mongoose.Schema(
  {
    lineOne: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Address line one is required"],
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "city name is required"],
    },
    state: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "state is required"],
    },
    pinCode: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "pincode is required"],
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    lineOne: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      trim: true,
      lowercase: true,
    },
    pinCode: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

const otherField = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
  },
  value: {
    type: String,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    trim: true,
    lowercase: true,
  },
});

const leaveData = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: [true, "Please provide reason for leave"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide end date"],
    },
    status: {
      type: String,
      enum: [
        "approved",
        "pending",
        "rejected",
        "withdrawl pending",
        "withdrawn",
        "withdrawl rejected",
        "withdrawl approved",
      ],
      default: "pending",
      required: false,
    },
    reviewedAt: {
      type: Date,
      required: false,
    },
    reviewedBy: {
      type: String,
      required: false,
    },
    leaveType: {
      type: String,
      required: [true, "Please provide leave type"],
    },
    applyingTo: {
      type: [String],
      required: [true, "Please provide applying to"],
    },
    comments: {
      type: String,
      required: false,
    },
    cc: {
      type: [String],
    },
    startDateSession: {
      type: String,
      enum: ["s1", "s2"],
    },
    endDateSession: {
      type: String,
      enum: ["s1", "s2"],
    },
    duration: {
      type: Number,
      required: false,
    },
    docName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const leaveTakenField = new mongoose.Schema({
  type: {
    type: String,
  },
  duration: {
    type: Number,
  },
});

module.exports = {
  addressSchemaRequired,
  addressSchema,
  otherField,
  leaveData,
  leaveTakenField,
};
