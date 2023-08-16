const mongoose = require("mongoose");
const {
  addressSchemaRequired,
  addressSchema,
  otherField,
  leaveData,
  leaveTakenField,
} = require("./utility");

const employeeSchema = new mongoose.Schema(
  {
    orgEmpId: {
      type: String,
      unique: true,
    },
    orgId: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "A employee must have a name"],
      trim: true,
      maxlength: [30, "A employee name must be less or equal to 30 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
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
      trim: true,
      enum: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"],
    },
    managerId: {
      type: String,
      trim: true,
      required: [true, "A employee must have a reporting managerId"],
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
  { timestamps: true }
);

//Employee model class
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee };
