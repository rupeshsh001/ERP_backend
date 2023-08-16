const { fallBackModel } = require("./model");
const { customResponse } = require("../../utility/helper");
const constant = require("../../constants/constant");

const getFallBackTime = async (req, res) => {
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.FALLBACK_FETCH_SUCCESS_MSG;
    const data = await fallBackModel.find({});
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message, err: error });
    return res.status(code).send(resData);
  }
};

const updateFallBackTime = async (req, res) => {
  let code, message;
  let fallBackObj;
  let fallBackData = {
    fallBackTime: req.body.time,
  };

  try {
    const data = await fallBackModel.find({});
    if (data.length > 0) {
      code = constant.HTTP_200_CODE;
      fallBackObj = await fallBackModel.findOneAndReplace({}, fallBackData);
      message = constant.FALLBACK_UPDATE_SUCCESS_MSG;
    } else {
      code = constant.HTTP_201_CODE;
      fallBackObj = await fallBackModel.create(fallBackData);
      message = constant.FALLBACK_ADD_SUCCESS_MSG;
    }

    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.FALLBACK_UPDATE_FAIL_MSG;
    const resData = customResponse({ code, message, err: error });
    return res.status(code).send(resData);
  }
};

module.exports = { getFallBackTime, updateFallBackTime };
