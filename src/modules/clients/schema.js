const Joi = require("joi");
//validation

const cimsSchema = Joi.object()
  .keys({
    legalName: Joi.string().required(),
    brandName: Joi.string().required(),
    domain: Joi.string().required(),
  })

  .options({ abortEarly: false, allowUnknown: true });

const locationSchema = Joi.object()
  .keys({
    pincode: Joi.string(),
    country: Joi.string(),
  })
  .options({ allowUnknown: true });

const updateSchema = Joi.object()
  .keys({
    legalName: Joi.string(),
    brandName: Joi.string(),
    domain: Joi.string(),
  })
  .options({ abortEarly: false, allowUnknown: true });

module.exports = { cimsSchema, locationSchema, updateSchema };
