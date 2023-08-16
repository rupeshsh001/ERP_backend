const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const allocationSchema = Joi.object()
  .keys({
    projectId: Joi.objectId(),
    empId: Joi.objectId(),
    startDate: Joi.string(),
    empPrimaryCapability: Joi.array(),
    endDate: Joi.string(),
    percentage: Joi.number(),
    rackRate: Joi.number(),
    description: Joi.string(),
  })
  .options({ abortEarly: false });

module.exports = { allocationSchema };
