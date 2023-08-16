const joi = require("joi");

const reviewSchema = joi
  .object({
    name: joi.string().required(),
    email: joi.string().email(),
    type: joi.string().valid("profile-creation", "profile-update").required(),
    status: joi.string().valid("accepted", "rejected", "pending"),
    message: joi.string(),
    employeeDetails: joi.object({
      _id: joi.any(),
      orgEmpId: joi.string().allow(null, ""),
      orgId: joi.string().allow(null, ""),
      createdAt: joi.date(),
      updatedAt: joi.date(),
      name: joi.string().max(30).required(),
      email: joi.string().email().required(),
      doj: joi.string().allow(null, "").required(),
      dob: joi.string().allow(null, ""),
      designation: joi.string().required(),
      department: joi.string(),
      primaryNo: joi.string(),
      secondaryNo: joi.string(),
      emergencyNo: joi.string(),
      currentAddress: joi.object().keys({
        lineOne: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        pinCode: joi.string().required(),
      }),
      residentialAddress: joi.object().keys({
        lineOne: joi.string(),
        city: joi.string(),
        state: joi.string(),
        pinCode: joi.string(),
      }),
      personalEmail: joi.string().email(),
      connections: joi.number(),
      hobbies: joi.array(),
      aboutMe: joi.string().allow(null, ""),
      graduation: joi.string().allow(null, ""),
      graduationUniversity: joi.string().allow(null, ""),
      postGraduation: joi.string().allow(null, ""),
      postGraduationUniversity: joi.string().allow(null, ""),
      primaryCapability: joi.array(),
      skillSet: joi.array(),
      certifications: joi.array(),
      personalDetails: joi.any(),
      professionalDetails: joi.any(),
      skillsDetails: joi.any(),
      ctc: joi.number().min(0),
      yearsOfExperience: joi.number().allow(null),
      status: joi.string().valid("active", "inactive", "deleted"),
      band: joi
        .string()
        .valid("B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"),
      managerId: joi.string(),
      appliedLeaves: joi.any().allow(null),
      leaveTaken: joi.any().allow(null),
    }),
  })
  .options({ abortEarly: false });

const reviewupdatedSchema = joi
  .object({
    status: joi.string().valid("accepted", "rejected", "pending"),
    message: joi.string().allow(null, ""),
  })
  .options({ abortEarly: false });

module.exports = { reviewSchema, reviewupdatedSchema };
