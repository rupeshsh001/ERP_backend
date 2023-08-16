const helpDesk = require("./model");
const { helpDeskSchema } = require("./schema");
const { customResponse, customPagination } = require("../../utility/helper");
const constant = require("../../constants/constant");

const createQuestionAndAnswer = async (req, res) => {
  let code, message, data;
  try {
    const { error } = helpDeskSchema.validate(req.body);
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
    if (!req.query.module) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_REQUEST_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }

    const query = { moduleName: req.query.module };
    const update = {
      $push: { data: { ...req.body } },
    };
    const options = { upsert: true, new: true };
    const newQuestion = await helpDesk.findOneAndUpdate(query, update, options);
    code = constant.HTTP_200_CODE;
    data = newQuestion;
    message = constant.QA_ADD_SUCCESS_MSG;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

const getQnAs = async (req, res) => {
  let code, message, data;
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 1000;
    let { module } = req.query;
    let query = {};
    if (module != null) query.moduleName = module;

    const allQnAs = await helpDesk.find(query, { moduleName: 1, data: 1 });
    code = constant.HTTP_200_CODE;
    message = constant.LEAVES_FETCH_SUCCESS_MSG;
    data = customPagination({ data: allQnAs, limit, page });
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

module.exports = { createQuestionAndAnswer, getQnAs };
