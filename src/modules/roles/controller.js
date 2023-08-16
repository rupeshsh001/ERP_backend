const rolesModal = require("./model");
const { customResponse } = require("../../utility/helper");
const constant = require("../../constants/constant");

//Get all records in database
const getRoles = async (req, res) => {
  try {
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    const role = req.query.role || "";
    if (role.length > 0) {
      const data = await rolesModal.find({ label: role });
      const resData = customResponse({
        data,
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      await getAllRoles(req, res);
    }
  } catch (error) {
    code = constant.HTTP_400_CODE;
    const resData = customResponse({
      code,
      err: error.errors,
    });
    return res.status(code).send(resData);
  }
};

const getAllRoles = async (req, res) => {
  try {
    let code, message;
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    const data = await rolesModal.find({}, { label: 1, _id: 0 });
    let roles = [];
    data.map((data) => {
      roles.push(data.label);
    });
    const resdata = customResponse({ code, message, data: roles });
    return res.status(code).send(resdata);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({ code, message, err: error.errors });
    return res.status(code).send(resData);
  }
};
module.exports = {
  getRoles,
  getAllRoles,
};
