const joi = require("joi");

const employeeSchema = joi
  .object()
  .keys({
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
    graduation: joi.string(),
    graduationUniversity: joi.string(),
    postGraduation: joi.string(),
    postGraduationUniversity: joi.string(),
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
    appliedLeaves: joi.any(),
    leaveTaken: joi.any(),
  })
  .options({ abortEarly: false });

const employeeUpdateSchema = joi
  .object()
  .keys({
    name: joi.string().max(30).required(),
    email: joi.string().email().required(),
    doj: joi.date().required(),
    dob: joi.date(),
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
    graduation: joi.string(),
    graduationUniversity: joi.string(),
    postGraduation: joi.string(),
    postGraduationUniversity: joi.string(),
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
    appliedLeaves: joi.any(),
    leaveTaken: joi.any(),
  })
  .options({ abortEarly: false });

const importEmployeeSchema = joi
  .object()
  .keys({
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
  })
  .options({ abortEarly: false });

const greythrImportSchema = joi
  .object()
  .keys({
    orgEmpId: joi.string().required(),
    orgId: joi.string().allow(null, ""),
    name: joi.string().required(),
    email: joi.string().email().required(),
    primaryNo: joi.string().allow(null, ""),
    designation: joi.string().allow(null, ""),
    department: joi.string().allow(null, ""),
    doj: joi.string().allow(null, ""),
    managerId: joi.string(),
  })
  .options({ abortEarly: false });

module.exports = {
  employeeSchema,
  employeeUpdateSchema,
  importEmployeeSchema,
  greythrImportSchema,
};
