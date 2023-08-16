const { Dropdown } = require("./model");
const APIFeatures = require("../../utility/apiFeatures");
const { customResponse } = require("../../utility/helper");
const mongoose = require("mongoose");
const constant = require("../../constants/constant");

const getDropdowns = async (req, res) => {
  let code, message;
  const allDropdowns = req.query.all || false;
  try {
    const features = new APIFeatures(Dropdown.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const dropdowns = await features.query;
    const countDoc = await Dropdown.count({});

    //return only true dropdowns
    if (!allDropdowns)
      dropdowns.forEach((item, index) => {
        let arr = item.fields.filter((value, index, arr) => {
          return value.active === true;
        });
        item.fields = arr;
      });

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = dropdowns;
    let totalDocuments = countDoc;
    let totalResult = dropdowns.length;
    const resData = customResponse({
      code,
      message,
      data,
      totalDocuments,
      totalResult,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

const handleGetDropdownByIdentifier = async (req, res) => {
  const identifier = req.params.identifier;
  if (mongoose.isValidObjectId(identifier)) {
    await getDropdown(req, res);
  } else {
    await getDropdownByName(req, res);
  }
};

exports.getAllDropdowns = async (req, res) => {
  let code, message;
  try {
    const features = new APIFeatures(Dropdown.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const dropdowns = await features.query;
    const countDoc = await Dropdown.count({});

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = dropdowns;
    let totalDocuments = countDoc;
    let totalResult = dropdowns.length;
    const resData = customResponse({
      code,
      message,
      data,
      totalDocuments,
      totalResult,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getDropdownByName = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findOne({
      name: req.params.identifier,
    });
    code = constant.HTTP_200_CODE;
    if (!dropdown) {
      code = constant.HTTP_204_CODE;
      message = constant.DROPDOWN_NOT_FOUND_MSG;
      const resData = {
        code,
        status: constant.STATUS_WARNING,
        message,
        error: constant.NO_DATA_FOUND_MSG,
      };
      return res.status(code).send(resData);
    }
    return res.status(code).send(dropdown);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      error: error.message,
    });
    return res.status(code).send(resData);
  }
};

const getDropdown = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findById(req.params.identifier);

    if (!dropdown) {
      code = constant.HTTP_400_CODE;
      message = constant.DROPDOWN_NOT_FOUND_BY_ID_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getDropdownComplete = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findById(req.params.id);

    if (!dropdown) {
      code = constant.HTTP_400_CODE;
      message = constant.DROPDOWN_NOT_FOUND_BY_ID_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.GET_DROPDOWN_SUCCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const createDropdown = async (req, res) => {
  let code, message;
  try {
    const newDropdown = await Dropdown.create(req.body);

    let code = constant.HTTP_201_CODE;
    let message = constant.CREATE_SUCCESS_MSG;
    let data = newDropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateDropdown = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dropdown) {
      code = constant.HTTP_400_CODE;
      message = constant.UPDATE_DROPDOWN_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.UPDATE_SUCCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.UPDATE_DROPDOWN_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const handleUpdate = async (req, res) => {
  const action = req.query.action;
  if (action === "update") {
    await addDropDownLabel(req, res);
  } else if (action === "remove") {
    await removeDropDownLabel(req, res);
  } else {
    code = constant.HTTP_400_CODE;
    message = "Bad Request";
    const resData = customResponse({
      code,
      message,
    });
    return res.status(code).send(resData);
  }
};

const addDropDownLabel = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findOneAndUpdate(
      { name: req.query.name },
      {
        $push: {
          fields: { label: req.body.label, value: req.body.value },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!dropdown) {
      code = constant.HTTP_404_CODE;
      message = constant.UPDATE_DROPDOWN_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.UPDATE_DROPDOWN_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const removeDropDownLabel = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findOneAndUpdate(
      { name: req.query.name },
      {
        $pull: {
          fields: { label: req.body.label },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!dropdown) {
      code = constant.HTTP_404_CODE;
      message = constant.REMOVE_DROPDOWN_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.REMOVE_DROPDOWN_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const deleteDropdown = async (req, res) => {
  let code, message;
  try {
    const dropdown = await Dropdown.findByIdAndDelete(req.params.id);
    if (!dropdown) {
      code = constant.HTTP_400_CODE;
      message = constant.DELETE_DROPDOWN_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_204_CODE;
    message = constant.DELETE_DROPDOWN_SUCCESS_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.DELETE_DROPDOWN_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const editDropDownLabelStatus = async (req, res) => {
  let code, message;

  try {
    const dropdown = await Dropdown.findByIdAndUpdate(req.body.id, {
      fields: req.body.newarray,
    });
    if (!dropdown) {
      code = constant.HTTP_404_CODE;
      message = constant.ACTIVE_STATUS_CHANGE_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.ACTIVE_STATUS_CHANGE_SUCCESS_MSG;
    let data = dropdown;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.ACTIVE_CHANGE_ERROR_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

module.exports = {
  getDropdowns,
  getDropdownByName,
  getDropdown,
  getDropdownComplete,
  createDropdown,
  updateDropdown,
  handleUpdate,
  addDropDownLabel,
  removeDropDownLabel,
  deleteDropdown,
  editDropDownLabelStatus,
  handleGetDropdownByIdentifier,
};
