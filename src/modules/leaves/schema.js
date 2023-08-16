const Joi = require("joi");

const leavesSchema = Joi.object()
  .keys({
    reason: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    leaveType: Joi.string().required(),
    applyingTo: Joi.array().required(),
    cc: Joi.array(),
    startDateSession: Joi.string(),
    endDateSession: Joi.string(),
    duration: Joi.number().required(),
    docName: Joi.string().allow(null, ""),
  })
  .options({ abortEarly: false });

const leavesTypeSchema = Joi.object()
  .keys({
    name: Joi.string().max(30).required(),
    quota: Joi.number().positive().required(),
    creditInterval: Joi.string().valid("quaterly", "half-yearly", "yearly"),
    lapsedCondition: Joi.string().valid("all-leaves", "carried-forward"),
    carryForward: Joi.number().positive(),
    status: Joi.string().valid("active", "inactive"),
  })
  .options({ abortEarly: false });

const leavesTypeUpdateSchema = Joi.object()
  .keys({
    name: Joi.string().max(30),
    quota: Joi.number().positive(),
    creditInterval: Joi.string().valid("quaterly", "half-yearly", "yearly"),
    lapsedCondition: Joi.string().valid("all-leaves", "carried-forward"),
    carryForward: Joi.number().positive(),
    status: Joi.string().valid("active", "inactive"),
  })
  .options({ abortEarly: false });

module.exports = { leavesSchema, leavesTypeSchema, leavesTypeUpdateSchema };
