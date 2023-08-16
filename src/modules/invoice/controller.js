const { customResponse, customPagination } = require("../../utility/helper");
const Invoice = require("./model");
const bankAccounts = require("./../../modules/others/bank.model");
const { querySchema, invoiceSchema } = require("./schema");
const {
  filterByInvoiceAmountReceived,
  filterById,
  filterByClientName,
  filterByProjectName,
} = require("./utility");
const { emailContent } = require("../../utility/poEmail");
const { emailSender } = require("../../middleware/POMailNotification");
const constant = require("../../constants/constant");

const getRelatedInvoices = async (req, res) => {
  const data = req.query.id;
  let code;
  try {
    const details = await Invoice.aggregate([
      {
        $lookup: {
          from: "purchase_ordertests",
          localField: "poId",
          foreignField: "_id",
          as: constant.PURCHASE_ORDERS,
        },
      },
      { $unwind: "$purchase_orders" },
      {
        $match: {
          "purchase_orders.projectId": data,
        },
      },
    ]);
    code = constant.HTTP_200_CODE;
    const resData = customResponse({ code, data: details });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getBankAccount = async (req, res) => {
  let code, message;
  try {
    const data = await bankAccounts.find({});
    code = constant.HTTP_200_CODE;
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getInvoiceDetails = async (req, res) => {
  let code, message;
  try {
    const { error } = querySchema.validate(req.query);
    if (error) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_REQ_DATA_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 15;

    const data = req.params.data;
    const val = constant.INVOICE_AMOUNT_RECEIVED;
    const val2 = "clientName";
    const val3 = "Id";
    const val4 = "projectName";
    const searchKeyword = req.query.keyword || "";

    if (data === val3) {
      code = constant.HTTP_200_CODE;
      const details = await Invoice.aggregate(filterById(searchKeyword));

      const data = customPagination({ data: details, page, limit });
      const resData = customResponse({ code, data });
      return res.status(code).send(resData);
    } else if (data === val) {
      code = constant.HTTP_200_CODE;
      const details = await Invoice.aggregate(
        filterByInvoiceAmountReceived(searchKeyword)
      ).sort(constant.INVOICE_AMOUNT_RECEIVED);

      const data = customPagination({ data: details, page, limit });
      const resData = customResponse({ code, data });
      return res.status(code).send(resData);
    } else if (data === val2) {
      code = constant.HTTP_200_CODE;
      const details = await Invoice.aggregate(
        filterByClientName(searchKeyword)
      ).collation({ locale: constant.LOCALE });

      const data = customPagination({ data: details, page, limit });
      const resData = customResponse({ code, data });
      return res.status(code).send(resData);
    } else if (data === val4) {
      code = constant.HTTP_200_CODE;
      const details = await Invoice.aggregate(
        filterByProjectName(searchKeyword)
      ).collation({
        locale: constant.LOCALE,
      });

      const data = customPagination({ data: details, page, limit });
      const resData = customResponse({ code, data });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_400_CODE;
      message = constant.SOMETHING_WRONG_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getInvoiceDetailsById = async (req, res) => {
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    const getDetails = await Invoice.findById(req.params.id).populate(
      "poId",
      "clientName projectName targettedResources targetedResAllocationRate poNumber poAmount"
    );
    const resData = customResponse({ code, data: getDetails });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const newInvoice = async (req, res) => {
  try {
    let code, message;
    const { error } = invoiceSchema.validate(req.body);

    if (error) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_DATA_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }
    code = constant.HTTP_201_CODE;
    const invoice = await Invoice.create(req.body);
    const getDetails = await Invoice.findOne({ _id: invoice._id }).populate(
      constant.PO_ID,
      "clientName projectName targettedResources targetedResAllocationRate poNumber poAmount currency"
    );
    const data = {
      clientName: getDetails.PO_Id.clientName,
      projectName: getDetails.PO_Id.projectName,
      poAmount: getDetails.PO_Id.poAmount,
      Received_Amount: getDetails.invoiceAmountReceived,
    };
    const content = await emailContent("N001", data);
    emailSender(content);

    if (req.body.amountReceivedOn) {
      const isoDate = getDetails.amountReceivedOn;
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const dt = date.getDate();
      let curr = getDetails.PO_Id.currency;
      curr =
        curr === constant.CURRENCY_INR
          ? constant.CURRENCY_RS
          : constant.CURRENCY_DOLLER;

      const newDate = dt + "-" + month + "-" + year;
      const data2 = {
        clientName: getDetails.PO_Id.clientName,
        projectName: getDetails.PO_Id.projectName,
        poNumber: getDetails.PO_Id.poNumber,
        amountReceivedOn: newDate,
        invoiceRaised: getDetails.invoiceRaised,
        invoiceAmountReceived: getDetails.invoiceAmountReceived,
        currency: curr,
      };

      const emailTemplate2 = await emailContent("N003", data2);
      emailSender(emailTemplate2);
    }
    const resData = customResponse({ code, data: invoice });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateInvoice = async (req, res) => {
  let code,
    message,
    updateStatus = constant.STATUS_DRAFT;
  const currDate = new Date();
  try {
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_UPDATE_DATA_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }

    const getDetails = await Invoice.findOne({ _id: req.params.id }).populate(
      constant.PO_ID,
      "clientName projectName targettedResources poNumber poAmount currency posowEndDate"
    );

    if (
      req.body.invoiceRaised.toLowerCase() === "yes" &&
      req.body.invoiceAmountReceived === null
    ) {
      Object.assign(req.body, { invoiceRaisedOn: new Date() });
    }

    if (getDetails.poId.posowEndDate < currDate) {
      updateStatus = constant.STATUS_OVERDUE;
    } else if (
      getDetails.poId.posowEndDate >= currDate &&
      req.body.invoiceRaised === "Yes" &&
      req.body.invoiceReceived === "Yes"
    ) {
      updateStatus = constant.STATUS_COMPLETE;
    } else if (
      getDetails.poId.posowEndDate >= currDate &&
      req.body.invoiceRaised === "Yes"
    ) {
      updateStatus = constant.STATUS_INVOICE_RAISED;
    }

    const updateDetails = await Invoice.updateOne(
      { _id: req.params.id },
      {
        $set: { ...req.body, status: updateStatus, updatedAt: new Date() },
      }
    );

    if (req.body.amountReceivedOn) {
      const isoDate = getDetails.amountReceivedOn;
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const dt = date.getDate();
      let curr = getDetails.poId.currency;
      curr =
        curr === constant.CURRENCY_INR
          ? constant.CURRENCY_RS
          : constant.CURRENCY_DOLLER;

      const newDate = dt + "-" + month + "-" + year;
      const data2 = {
        clientName: getDetails.poId.clientName,
        projectName: getDetails.poId.projectName,
        poNumber: getDetails.poId.poNumber,
        amount_received_on: newDate,
        invoiceRaised: getDetails.invoiceRaised,
        invoiceAmountReceived: getDetails.invoiceAmountReceived,
        currency: curr,
      };

      const emailTemplate2 = await emailContent("N003", data2);
      emailSender(emailTemplate2);
    }
    code = constant.HTTP_200_CODE;
    message = constant.DATA_UPDATE_SUCCESS_MSG;
    const resData = customResponse({
      code,
      data: updateDetails,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

module.exports = {
  getRelatedInvoices,
  getBankAccount,
  getInvoiceDetails,
  getInvoiceDetailsById,
  newInvoice,
  updateInvoice,
};
