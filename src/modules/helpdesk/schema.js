const joi = require("joi");

const helpDeskSchema = joi
  .object()
  .keys({
    question: joi.string().required(),
    answer: joi.string().required(),
  })
  .options({ abortEarly: false });

module.exports = {
  helpDeskSchema,
};
