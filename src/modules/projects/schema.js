const Joi = require("joi");

const projectsSchema = Joi.object()
  .keys({
    clientId: Joi.string(),
    clientName: Joi.string().required(),
    clientPrimaryContactName: Joi.string(),
    projectName: Joi.string().required(),
    clientProjectManager: Joi.string().required(),
    startDate: Joi.string().allow(null).allow("").optional(),
    endDate: Joi.string().allow(null).allow("").optional(),
    clientProjectSponsor: Joi.string().required(),
    clientFinanceController: Joi.string().required(),
    clientPrimaryContact: Joi.number(),
    vbProjectManager: Joi.string().allow(""),
    domainSector: Joi.string(),
    vbProjectStatus: Joi.string().valid(
      "Yet to Begin",
      "On Hold",
      "Completed",
      "Active"
    ),
  })
  .options({ abortEarly: false });

module.exports = { projectsSchema };
