const Joi = require("joi");

const poSowSchema = Joi.object()
  .keys({
    projectId: Joi.string().required(),
    clientName: Joi.string().min(3).max(30).lowercase().required(),
    projectName: Joi.string().required(),
    clientSponser: Joi.string().required(),
    clientFinanceController: Joi.string().required(),
    targettedResources: Joi.object().required(),
    targetedResAllocationRate: Joi.object().required(),
    Type: Joi.string().alphanum().valid("PO", "SOW").required(),
    poAmount: Joi.number().required(),
    currency: Joi.string().alphanum().required(),
    documentName: Joi.string().required(),
    posowEndDate: Joi.date().iso().required(),
    remarks: Joi.string().empty(""),
  })
  .options({ abortEarly: false });

const querySchema = Joi.object().keys({
  page: Joi.number().integer().positive(),
  limit: Joi.number().integer().positive(),
  keyword: Joi.string().empty(""),
});

module.exports = { poSowSchema, querySchema };
