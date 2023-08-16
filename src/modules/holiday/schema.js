const Joi = require("joi");

const holidayCalSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow(null).allow("").optional(),
    duration: Joi.number(),
    type: Joi.string().valid("General", "Restricted"),
  })
  .options({ abortEarly: false });

module.exports = { holidayCalSchema };
