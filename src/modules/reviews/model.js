const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require("validator");

const addressSchemaRequired = new mongoose.Schema(
  {
    lineOne: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    pinCode: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    lineOne: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const otherField = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  value: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
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
      enum: ["approved", "pending", "rejected", "withdrawn"],
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

const employeeSchemaForReview = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A employee must have a name"],
      trim: true,
      maxlength: [30, "A employee name must be less or equal to 30 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
    },
    doj: {
      type: Date,
      required: [true, "A employee must have a date of joining"],
    },
    department: {
      type: String,
      lowercase: true,
      trim: true,
      default: "other",
    },
    designation: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "A employee must have a designation"],
    },
    managerId: {
      type: String,
      trim: true,
      required: [true, "A employee must have a reporting managerId"],
    },
    primaryNo: {
      type: String,
    },
    secondaryNo: {
      type: String,
    },
    emergencyNo: {
      type: String,
    },
    currentAddress: addressSchemaRequired,
    residentialAddress: addressSchema,
    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    dob: {
      type: Date,
    },
    connections: {
      type: Number,
      trim: true,
    },
    hobbies: {
      type: Array,
      trim: true,
      default: [],
    },
    aboutMe: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    graduation: {
      type: String,
      trim: true,
      lowercase: true,
    },
    graduationUniversity: {
      type: String,
      trim: true,
      lowercase: true,
    },
    postGraduation: {
      type: String,
      trim: true,
      lowercase: true,
    },
    postGraduationUniversity: {
      type: String,
      trim: true,
      lowercase: true,
    },
    primaryCapability: {
      type: Array,
      trim: true,
      default: [],
    },
    skillSet: {
      type: Array,
      trim: true,
      default: [],
    },
    certifications: {
      type: Array,
      trim: true,
      default: [],
    },

    personalDetails: {
      type: [otherField],
      default: [],
    },
    professionalDetails: {
      type: [otherField],
      default: [],
    },
    skillsDetails: {
      type: [otherField],
      default: [],
    },

    ctc: {
      type: Number,
      min: 0,
      default: 0,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    band: {
      type: String,
      enum: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"],
    },
    appliedLeaves: {
      type: [leaveData],
      default: [],
    },
    leaveTaken: {
      type: [leaveTakenField],
      default: [],
    },
  },
  { _id: false }
);

const ReviewSchema = mongoose.Schema(
  {
    reqId: {
      type: Number,
      unique: true,
    },
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    type: {
      required: true,
      enum: ["profile-creation", "profile-update"],
      type: String,
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
    employeeDetails: {
      type: employeeSchemaForReview,
    },
  },
  { timestamps: true }
);

ReviewSchema.plugin(AutoIncrement, { inc_field: "reqId" });

//Review model class
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
