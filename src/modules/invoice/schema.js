const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const invoiceSchema = Joi.object()
  .keys({
    poId: Joi.objectId(),
    clientSponsor: Joi.string().required(),
    clientFinanceController: Joi.string(),
    invoiceRaised: Joi.string().valid("Yes", "No"),
    status: Joi.string().valid(
      "Overdue",
      "Invoice raised",
      "Complete",
      "Draft"
    ),
    invoiceReceived: Joi.string().valid("Yes", "No"),
    invoiceAmountReceived: Joi.number().allow(null),
    vbBankAccount: Joi.string().allow(null),
    amountReceivedOn: Joi.date().iso().allow(null),
    remarks: Joi.string().allow(null),
  })
  .options({ abortEarly: false });

const querySchema = Joi.object().keys({
  page: Joi.number().integer().positive(),
  limit: Joi.number().integer().positive(),
  keyword: Joi.string().empty(""),
});

module.exports = { invoiceSchema, querySchema };
