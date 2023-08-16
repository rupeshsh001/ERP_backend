const mongoose = require("mongoose");
const APIFeatures = require("../../utility/apiFeatures");
const { customResponse } = require("../../utility/helper");
const s3Client = require("../../utility/s3Instance");
const { Employee } = require("./model");
const { importEmployeeSchema, greythrImportSchema } = require("./schema");
const constant = require("../../constants/constant");
const logger = require("../../utility/logger/baseLogger");

const incrementEmployeeId = async () => {
  const { orgEmpId } = await Employee.findOne().sort({ orgEmpId: -1 });
  const number = orgEmpId.split("VB")[1] * 1 + 1;
  let stringId;
  if (number < 10) {
    stringId = `VB000${number}`;
  } else if (number < 100) {
    stringId = `VB00${number}`;
  } else {
    stringId = `VB0${number}`;
  }
  return stringId;
};

const generateQR = async (req, res) => {
  try {
    res.send(await QRCode.toDataURL(`https://www.geeksforgeeks.org/`));
  } catch (err) {
    logger.error(err);
  }
};

const getAllEmployees = async (req, res) => {
  let code, message;
  try {
    //Build the query
    const features = new APIFeatures(
      Employee.find().collation({ locale: constant.LOCALE }),
      req.query
    )
      .filter()
      .searchEmp()
      .sort()
      .limitFields()
      .paginate();

    //Execute the query
    const employees = await features.query;
    const searchQuery = new APIFeatures(Employee.find(), req.query)
      .filter()
      .searchEmp()
      .sort()
      .limitFields();
    const totalCount = await searchQuery.query.count();

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = employees;
    let totalResult = employees.length;
    const resData = customResponse({
      code,
      message,
      data,
      totalResult,
      totalCount,
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

const getEmployee = async (req, res) => {
  let code, message;
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    code = constant.HTTP_400_CODE;
    message = constant.INVALID_OBJ_ID_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      code = constant.HTTP_400_CODE;
      message = constant.EMPLOYEE_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = employee;
    const resData = customResponse({ code, message, data });
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

const createEmployee = async (req, res) => {
  let code, message;
  try {
    const incrementedEmpId = await incrementEmployeeId();
    req.body.orgEmpId = incrementedEmpId;
    const newEmployee = await Employee.create(req.body);

    let code = constant.HTTP_201_CODE;
    let message = constant.SUCESS_MSG;
    let data = newEmployee;
    const resData = customResponse({ code, message, data });
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

const updateEmployee = async (req, res) => {
  let code, message;
  let isSuperAdmin = req.decoded.roles.includes("super_admin");
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    code = constant.HTTP_400_CODE;
    message = constant.INVALID_OBJ_ID_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: !isSuperAdmin,
    });

    if (!employee) {
      code = constant.HTTP_400_CODE;
      message = constant.UPDATE_EMPLOYEE_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.SUCESS_MSG;
    let data = employee;
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.UPDATE_EMPLOYEE_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const deleteEmployee = async (req, res) => {
  let code, message;
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    code = constant.HTTP_400_CODE;
    message = constant.INVALID_OBJ_ID_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      code = constant.HTTP_400_CODE;
      message = constant.EMPLOYEE_DEL_FAIL_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    code = constant.HTTP_200_CODE;
    message = constant.EMPLOYEE_DEL_SUCCESS_MSG;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.EMPLOYEE_DEL_FAIL_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const searchEmployeesRR = async (req, res) => {
  let code, message;
  const searchName = req.query;
  try {
    if (Object.keys(req.query).length === 0) {
      const employees = await Employee.find({});
      code = constant.HTTP_200_CODE;
      const resData = customResponse({ code, data: employees });
      res.status(code).send(resData);
    } else {
      const employees = await Employee.find({
        $or: [
          { name: { $regex: searchName.search.trim(), $options: "i" } },
          { email: { $regex: searchName.search.trim(), $options: "i" } },
        ],
      });
      if (employees.length < 1) {
        code = constant.HTTP_400_CODE;
        message = constant.NO_REWARDS_FOUND_MSG;
        const resdata = customResponse({ code, message });
        return res.status(code).send(resdata);
      }
      code = constant.HTTP_200_CODE;
      const resData = customResponse({ code, data: employees });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_404_CODE;
    message = constant.SERVER_ERR;
    const resdata = customResponse({ code, message, err: error });
    res.status(code).send(resdata);
  }
};

const getPicture = async (req, res) => {
  let code, message;
  const folder = "profiles/";
  const fileName = folder + req.params.fileName + ".png";
  const params = {
    Key: fileName,
    Bucket: process.env.AWS_BUCKET_NAME,
  };
  let base64String;
  s3Client.getObject(params, (error, data) => {
    if (error) {
      code = constant.HTTP_404_CODE;
      message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_200_CODE;
      base64String = data.Body.toString("base64");
      const imageString = "data:image/png;base64," + base64String;
      //return res.send(imageString);
      const resdata = customResponse({ code, data: imageString });
      return res.status(code).send(resdata);
    }
  });
};

const importEmployees = async (req, res) => {
  let code, message;
  try {
    if (!Boolean(req.body instanceof Array)) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_DATA_MSG;
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
    let arrayOfJoiError = [];
    req.body.forEach((employee, index) => {
      if (importEmployeeSchema.validate(employee).error)
        arrayOfJoiError.push({
          index,
          validationError: importEmployeeSchema
            .validate(employee)
            .error?.details.map((el) => el.message),
        });
    });

    if (arrayOfJoiError.length) {
      let code = constant.HTTP_206_CODE;
      let errorName = constant.JOI_ERROR;
      let message = constant.INADEQUATE_DATA_MSG;
      const resdata = customResponse({
        code,
        status: constant.STATUS_ERROR,
        message,
        err: {
          errorName,
          importError: arrayOfJoiError,
        },
      });
      return res.status(code).send(resdata);
    }

    let employeesRes = [];
    let importError = [];

    for (let i = 0; i < req.body.length; i++) {
      let incrementedEmpId = await incrementEmployeeId();
      let currentBody = req.body[i];
      currentBody.orgEmpId = incrementedEmpId;
      try {
        const result = await Employee.create(currentBody);
        employeesRes.push({ index: i, message: result });
      } catch (err) {
        importError.push({
          index: i,
          message: `Email already exist, ${err.keyValue.email}`,
        });
      }
    }
    code = constant.HTTP_200_CODE;
    const resdata = customResponse({
      code,
      status: importError.length
        ? employeesRes.length
          ? constant.STATUS_WARNING
          : constant.STATUS_ERROR
        : constant.STATUS_SUCCESS,
      message: importError.length
        ? employeesRes.length
          ? constant.SUCCESS_WITH_ERR_MSG
          : constant.FAILED_TO_IMPORT_MSG
        : constant.IMPORT_SUCCESS_MSG,
      data: employeesRes,
      err: importError.length
        ? { errorName: constant.MONGO_ERROR, importError }
        : { errorName: null, importError: [] },
    });
    return res.status(code).send(resdata);
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
};

const grethrImport = async (req, res) => {
  try {
    let code, message;
    if (!Boolean(req.body instanceof Array)) {
      code = constant.HTTP_400_CODE;
      message = constant.INVALID_DATA_MSG;
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
    let arrayOfJoiError = [];
    req.body.forEach((employee, index) => {
      if (greythrImportSchema.validate(employee).error)
        arrayOfJoiError.push({
          index: index,
          validationError: greythrImportSchema
            .validate(employee)
            .error?.details.map((el) => el.message),
        });
    });

    if (arrayOfJoiError.length) {
      let code = constant.HTTP_206_CODE;
      let errorName = constant.JOI_ERROR;
      let message = constant.INADEQUATE_DATA_MSG;
      const resdata = customResponse({
        code,
        status: constant.STATUS_ERROR,
        message,
        err: {
          errorName,
          importError: arrayOfJoiError,
        },
      });
      return res.status(code).send(resdata);
    }

    let employeesRes = [];
    let importError = [];

    for (let i = 0; i < req.body.length; i++) {
      try {
        const result = new Employee(req.body[i]);
        await result.save({ validateBeforeSave: false }, function (error) {});
        employeesRes.push({ index: i, message: result });
      } catch (err) {
        importError.push({
          index: i,
          message: `Email already exist, ${err.keyValue.email}`,
        });
      }
    }
    code = constant.HTTP_200_CODE;
    const resdata = customResponse({
      code,
      status: importError.length
        ? employeesRes.length
          ? constant.STATUS_WARNING
          : constant.STATUS_ERROR
        : constant.STATUS_SUCCESS,
      message: importError.length
        ? employeesRes.length
          ? constant.SUCCESS_WITH_ERR_MSG
          : constant.FAILED_TO_IMPORT_MSG
        : constant.IMPORT_SUCCESS_MSG,
      data: employeesRes,
      err: importError.length
        ? { errorName: constant.MONGO_ERROR, importError }
        : { errorName: null, importError: [] },
    });
    return res.status(code).send(resdata);
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
};

const uploadPicture = (req, res) => {
  let code, message;
  const folder = "profiles/";
  const fileName = folder + req.body.name + ".png";
  const buf = Buffer.from(
    req.body.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const data = {
    Key: fileName,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image",
    Bucket: process.env.AWS_BUCKET_NAME,
  };
  s3Client.putObject(data, function (error, data) {
    if (error) {
      code = constant.HTTP_404_CODE;
      message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_200_CODE;
      message = constant.UPLOAD_PROFILE_PIC_SUCCESS_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  });
};

const deletePicture = (req, res) => {
  let code, message;
  const folder = "profiles/";
  const fileName = folder + req.params.fileName + ".png";
  const params = {
    Key: fileName,
    Bucket: process.env.AWS_BUCKET_NAME,
  };
  s3Client.deleteObject(params, (error, data) => {
    if (error) {
      code = constant.HTTP_404_CODE;
      message = constant.SERVER_ERR;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      logger.error(error);
      return res.status(code).send(resData);
    } else {
      code = constant.HTTP_200_CODE;
      message = constant.DEL_PROFILE_PIC_SUCCESS_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  });
};

module.exports = {
  generateQR,
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployeesRR,
  getPicture,
  importEmployees,
  grethrImport,
  uploadPicture,
  deletePicture,
};
