const { customResponse, customPagination } = require("../../utility/helper");
const projectsSchema = require("../../modules/projects/model");
const projectEmployeeModel = require("../../modules/allocations/model");
const s3Client = require("./../../utility/s3Instance");
const purchaseOrderModel = require("./model");
const { querySchema, poSowSchema } = require("./schema");
const Invoice = require("../invoice/model");
const { emailContent } = require("../../utility/poEmail");
const { emailSender } = require("../../middleware/POMailNotification");
const busboy = require("busboy");
const { generateId } = require("./utility");
const constant = require("../../constants/constant");

const downloadFile = (req, res) => {
  let code, message;
  const folder = "contracts/";
  const fileName = req.params.fileName;
  const fName = folder + fileName;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fName,
  };

  s3Client.getObject(params, (err, data) => {
    if (err) {
      code = constant.HTTP_404_CODE;
      message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: err,
      });
      return res.status(code).send(resData);
    } else {
      res.attachment(fileName);
      s3Client.getObject(params).createReadStream().pipe(res);
    }
  });
};

const getPoDetail = async (req, res) => {
  let code, message;
  const _id = req.params.id;
  try {
    code = constant.HTTP_200_CODE;
    const data = await purchaseOrderModel.findById({ _id });
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

const getSortedPoList = async (req, res) => {
  let code, message;

  const fieldName = req.params.fieldName;
  try {
    const { error } = querySchema.validate(req.query);
    if (error) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_REQ_QUERY_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 15;
    code = constant.HTTP_200_CODE;
    let query = {};

    if (parseInt(req.query.keyword)) {
      query.$or = [{ poAmount: req.query.keyword }];
    } else {
      query.$or = [
        { clientName: { $regex: req.query.keyword, $options: "i" } },
        { projectName: { $regex: req.query.keyword, $options: "i" } },
        { clientSponser: { $regex: req.query.keyword, $options: "i" } },
        { poNumber: { $regex: req.query.keyword, $options: "i" } },
        {
          clientFinanceController: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
      ];
    }
    if (fieldName === "Id") {
      const users = await purchaseOrderModel.find(query);
      const data = customPagination({ data: users, page, limit });
      const resData = customResponse({ code, data });
      return res.status(code).send(resData);
    }
    const users = await purchaseOrderModel
      .find(query)
      .sort(fieldName)
      .collation({ locale: constant.LOCALE });
    const data = customPagination({ data: users, page, limit });
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

const getClients = async (req, res) => {
  let code, message;
  try {
    const data = await projectsSchema.aggregate([
      {
        $group: {
          _id: "$clientName",
          Counter: { $sum: 1 },
        },
      },
      {
        $match: {
          Counter: { $gte: 1 },
        },
      },
      { $project: { clientName: "$_id", _id: 0 } },
    ]);
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

const getProjectsByClient = async (req, res) => {
  let code, message;
  try {
    const data = await projectsSchema.find(
      { clientName: req.params.clientName },
      { projectName: 1 }
    );
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

const getDetails = async (req, res) => {
  const query = req.query.projectId;
  let code;
  try {
    const data = await projectEmployeeModel
      .find({ projectId: query })
      .populate({
        path: "empId",
        model: "EmployeeTest",
        select: "_id orgEmpId name",
      })
      .populate(
        "projectId",
        "_id vbProjectId projectName clientProjectSponsor clientFinanceController"
      );
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

const createPoSow = async (req, res) => {
  try {
    const { error } = poSowSchema.validate(req.body);
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
    const st = req.body.Type;
    let counter;
    let po = "PO";
    let sow = "SOW";
    let num;

    if (st.toLowerCase() === "po") {
      counter = await purchaseOrderModel.countDocuments({ Type: "PO" });
      counter = counter + 1;
      const genarateID = generateId(counter, po);
      num = genarateID;
    } else {
      counter = await purchaseOrderModel.countDocuments({ Type: "SOW" });
      counter = counter + 1;
      const genarateID = generateId(counter, sow);
      num = genarateID;
    }
    const poSow = await new purchaseOrderModel({
      ...req.body,
      poNumber: num,
    }).save();

    const invoices = new Invoice({
      poId: poSow._id,
      clientSponsor: poSow.clientSponser,
      clientFinanceController: poSow.clientFinanceController,
    });
    const invoice = await invoices.save();

    const getDetails = await Invoice.findOne({ _id: invoice._id }).populate(
      constant.PO_ID,
      "clientName projectName targettedResources poNumber poAmount currency"
    );

    const data = {
      clientName: getDetails.poId.clientName,
      projectName: getDetails.poId.projectName,
      poAmount: getDetails.poId.poAmount,
      Received_Amount: getDetails.invoiceAmountReceived,
    };
    const content = await emailContent("N001", data);
    emailSender(content);

    code = constant.HTTP_201_CODE;
    const resdata = customResponse({ code, data: poSow });
    return res.status(code).send(resdata);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

const uploadFile = (req, res) => {
  let chunks = [];
  let fName, fEncoding, fMimeType;
  const folder = "contracts/";
  const bb = busboy({ headers: req.headers });
  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    fName = folder + filename;
    fEncoding = encoding;
    fMimeType = mimeType;
    file.on("data", (data) => {
      chunks.push(data);
    });
  });
  bb.on("finish", async () => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fName,
      Body: Buffer.concat(chunks),
      ContentEncoding: fEncoding,
      ContentType: fMimeType,
    };
    try {
      await s3Client.putObject(params).promise();
      res.send({
        status: constant.STATUS_SUCCESS,
        msg: constant.FILE_UPLOAD_SUCCESS_MSG,
      });
    } catch (error) {
      let code = constant.HTTP_404_CODE;
      let message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
  });
  req.pipe(bb);
};

const updatePODetails = async (req, res) => {
  let code,
    message,
    updateStatus = constant.STATUS_DRAFT;
  const currDate = new Date();
  try {
    const { error } = poSowSchema.validate(req.body);
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
    const updateDetails = await purchaseOrderModel.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body, Updated_At: new Date() },
      { new: true }
    );
    await updateDetails.save();

    const getDetails = await Invoice.findOne({
      PO_Id: req.params.id,
    });

    if (updateDetails.posowEndDate < currDate) {
      updateStatus = constant.STATUS_OVERDUE;
    } else if (
      updateDetails.posowEndDate >= currDate &&
      getDetails.invoice_raised === "Yes" &&
      getDetails.invoice_received === "Yes"
    ) {
      updateStatus = constant.STATUS_COMPLETE;
    } else if (
      updateDetails.posowEndDate >= currDate &&
      getDetails.invoice_raised === "Yes"
    ) {
      updateStatus = constant.STATUS_INVOICE_RAISED;
    }

    await Invoice.updateOne(
      { _id: getDetails._id },
      {
        $set: { Status: updateStatus, updated_at: new Date() },
      }
    );

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
  downloadFile,
  getPoDetail,
  getSortedPoList,
  getClients,
  getProjectsByClient,
  getDetails,
  createPoSow,
  uploadFile,
  updatePODetails,
};
