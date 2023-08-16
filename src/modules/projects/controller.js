// importing required Files and Routes
const { json } = require("body-parser");
const moment = require("moment");
const ProjectsInfoModel = require("./model");
const { getQueryString } = require("../../utility/pmoUtils");
//JOI
const { projectsSchema } = require("./schema");
const { customResponse, customPagination } = require("../../utility/helper");
const constant = require("../../constants/constant");
const logger = require("../../utility/logger/baseLogger");

// Creating and Storing Created Projects data into database by POST request
const createProjects = async (req, res) => {
  let code, message;
  try {
    const { error } = projectsSchema.validate(req.body);
    if (error) {
      code = constant.HTTP_422_CODE;
      message = constant.INVALID_REQ_DATA_MSG;
      const resData = customResponse({
        code,
        message,
        err: error && error.details,
      });
      return res.status(code).send(resData);
    }

    const allProjects = await ProjectsInfoModel.find({});
    const project = await ProjectsInfoModel({
      ...req.body,
      vbProjectId: `VB-PROJ-${allProjects.length + 1}`,
    });
    project.save();
    code = constant.HTTP_201_CODE;
    const resData = customResponse({
      code,
      message,
      data: project,
    });
    return res.status(code).send(resData);
  } catch (error) {
    logger.error(error);
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

// Updating project by its _id
const updateProject = async (req, res) => {
  let code, message, resData;
  try {
    const _id = req.params.id;
    const updateProject = await ProjectsInfoModel.findOneAndUpdate(
      { vbProjectId: _id },
      req.body,
      {
        new: true,
      }
    );
    code = constant.HTTP_200_CODE;
    message = constant.UPDATE_PROJECT_SUCCESS;
    resData = customResponse({ code, message, data: updateProject });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

// Updating all project by Client _id
const updateAllProjectByClientId = async (req, res) => {
  let code, message, resData;
  try {
    const clientId = req.params.id;
    const updateProject = await ProjectsInfoModel.updateMany(
      { clientId },
      req.body,
      {
        new: true,
      }
    );
    code = constant.HTTP_200_CODE;
    message = constant.CLIENT_INFO_UPDATE_SUCCESS_MSG;
    resData = customResponse({ code, message, data: updateProject });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

// getting all the active projects
const getProjects = async (req, res) => {
  const query = getQueryString(req.query);
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  const fieldName = req.query.fieldName;
  const status = req.query.status;
  let code, message;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.DATA_FETCH_MSG;
    let projects;
    if (fieldName === "vbProjectId") {
      projects = await ProjectsInfoModel.find({
        $and: [
          { $and: query },
          {
            vbProjectStatus:
              status === constant.STATUS_OTHERS
                ? { $in: ["Yet to Begin", "On Hold"] }
                : status,
          },
        ],
      })
        .sort(fieldName)
        .collation({ locale: "en_US", numericOrdering: true });
    } else {
      projects = await ProjectsInfoModel.find({
        $and: [
          { $and: query },
          {
            vbProjectStatus:
              status === constant.STATUS_OTHERS
                ? { $in: ["Yet to Begin", "On Hold"] }
                : status,
          },
        ],
      }).sort(fieldName);
    }
    const data = customPagination({ data: projects, page, limit });
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

//getting single project by its _id
const getProjectById = async (req, res) => {
  let code, message, resData;
  try {
    code = constant.HTTP_200_CODE;
    message = constant.GET_PROJECT_ID_SUCCESS;
    const _id = req.params.id;
    const getProject = await ProjectsInfoModel.find({ vbProjectId: _id });
    resData = customResponse({ code, message, data: getProject });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};

//exporting to use in other files
module.exports = {
  createProjects,
  updateProject,
  getProjects,
  getProjectById,
  updateAllProjectByClientId,
};
