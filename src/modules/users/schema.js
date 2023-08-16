const Joi = require("joi");

const addUserSchema = Joi.object()
  .keys({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(1).max(30),
    password: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(3).max(30).required(),
    role: Joi.array(),
  })
  .options({ abortEarly: false });

const importUserSchema = Joi.object()
  .keys({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.array(),
  })
  .options({ abortEarly: false });

const loginSchema = Joi.object()
  .keys({
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(1).max(50).required(),
    idToken: Joi.string(),
  })
  .options({ abortEarly: false });

module.exports = { addUserSchema, loginSchema, importUserSchema };
