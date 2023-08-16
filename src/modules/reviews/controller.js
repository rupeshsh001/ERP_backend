const Review = require("./model");
const { Employee } = require("../employee/model");
const { reviewSchema, reviewupdatedSchema } = require("./schema");

const AppError = require("../../utility/appError");
const APIFeatures = require("../../utility/apiFeatures");
const { customResponse } = require("../../utility/helper");
const constant = require("../../constants/constant");
const { CodeBuild } = require("aws-sdk");
const logger = require("../../utility/logger/baseLogger");

exports.getAllReviews = async (req, res) => {
  /* 	#swagger.tags = ['Review']
      #swagger.description = 'Get reviews list' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "message": "",
          "data": {
            "results": [
              {
                "_id": "610d090636ba149966bd3b55",
               "createdAt":"2021-11-26T09:25:14.681Z",
               "updatedAt":"2021-11-26T09:25:14.681Z"
              }
            ]
          },
          "error": {}
        }
      }
  */
  try {
    //Build the query
    const features = new APIFeatures(Review.find(), req.query)
      .filter()
      .searchReview()
      .sort()
      .limitFields()
      .paginate();

    //Execute the query
    const reviews = await features.query;
    const searchQuery = new APIFeatures(Review.find(), req.query)
      .filter()
      .searchReview()
      .sort()
      .limitFields();
    const totalCount = await searchQuery.query.count();

    //Send response
    let code = constant.HTTP_200_CODE;
    let message = constant.SUCESS_MSG;
    let data = { reviews };
    let totalResult = reviews.length;
    const resData = customResponse({
      code,
      message,
      data,
      totalResult,
      totalCount,
    });
    return res.status(code).json(resData);
  } catch (err) {
    let code = constant.HTTP_400_CODE;
    let message = err.message;
    const resData = customResponse({
      code,
      message,
      err: err.errors,
    });
    return res.status(code).send(resData);
  }
};

exports.getReview = async (req, res) => {
  /* 	#swagger.tags = ['Review']
      #swagger.description = 'Get reviews list' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "message": "",
          "data": {
            "results": [
              {
                "_id": "61af3ce7fd077c922fadd9ba",
      "reqId": 10,
      "reqName": "admin",
      "reqType": "profile-creation",
      "status": "pending",
      "employeeDetails": {
        "slackMemId": "",
        "empName": "alan sajan",
        "empEmail": "sajan@mail.com",
        "empDoj": "2021-11-20T00:00:00.000Z",
        "empDob": "2021-11-20T00:00:00.000Z",
        "empDepartment": "sales",
        "empDesignation": "marketing",
        "empReportingManager": "sunilee",
        "empConnections": 10,
        "empHobbies": [
          "Music",
          "Dance"
        ],
        "empAboutMe": "i'm always cool..!",
        "empCurrentAddress": "gujrat",
        "empResidentialAddress": "gujrat",
        "empBand": "12",
        "empGraduation": "bba",
        "empGraduationUniversity": "du",
        "empPostGraduation": "mba",
        "empPostGraduationUniversity": "iim",
        "empPrimaryCapability": [
          "Communication"
        ],
        "empSkillSet": [
          "Communication skill"
        ],
        "empCertifications": [
          "Power Bi"
        ],
        "role": "employee",
        "personalDetails": [],
        "professionalDetails": [],
        "skillsDetails": []
      },
      "createdAt": "2021-12-07T10:52:23.199Z",
      "updatedAt": "2021-12-07T10:52:23.199Z",
      "__v": 0
              }
            ]
          },
          "error": {}
        }
      }
  */
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      code = constant.HTTP_400_CODE;
      message = constant.REVIEW_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
    code = constant.HTTP_200_CODE;
    data = { review };
    const resData = customResponse({ code, data });
    res.status(code).send(resData);
  } catch (err) {
    logger.error(err);
    code = constant.HTTP_400_CODE;
    message = constant.REVIEW_NOT_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
    });
    return res.status(code).send(resData);
  }
};

exports.createReview = async (req, res) => {
  /*#swagger.tags = ['Review']
    #swagger.description = 'Create new Review'
        #swagger.parameters['obj'] = {
          in: 'body',
          schema: {
              "reqType": "profile-update",
              "reqName": "DIVYANSHU",
              "status": "pending",
              "employeeDetails": {
                "empName": "name3",
                "empEmail": "name3@email.com",
                "empDoj": "11/10/90",
                "empDepartment": "Development",
                "empDesignation": "Developer Relations",
                "empBand": "90",
                "empCtc": 600000,
                "empReportingManager": "Gautam",
                "empPersonalEmail": "name3@email.com",
                "empPhoneNumber": "8984645",
                "empDob": "1/1/20",
                "empGraduation": "College_name_goes_here",
                "empAboutMe": "Tech Enthusiast",
                "empHobbies": [
                  "Cricket",
                  "Movies"
                ],
                "empPrimaryCapability": [],
                "empSkillSet": [],
                "empCertifications": [
                  "AWS",
                  "Scrum"
                ],
                "role": "LEADERSHIP"
              }          
            }  
  }*/
  try {
    const { error } = reviewSchema.validate(req.body);
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

    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: constant.STATUS_SUCCESS,
      data: newReview,
    });
  } catch (err) {
    logger.error(err);
    code = constant.HTTP_400_CODE;
    const resData = customResponse({
      code,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

exports.updateReview = async (req, res) => {
  /* 
      #swagger.tags = ['Review']
      #swagger.description = 'Update Review' 
       #swagger.parameters['id'] = {
       in: 'path',
       type: 'string',
       description: 'Review id which we want to update/edit'
      }
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
              $reqId: 5,
              $reqName: "admadsin",
              $reqType: "profile-creation",
              $status: "pending",
              $employeeDetails: {
                  $empName: "alan sajan",
                  $empEmail: "sajan@mail.com",
                  $empDoj: "2021-11-20T00:00:00.000Z",
                  $empDob: "2021-11-20T00:00:00.000Z",
                  $empDepartment: "sales",
                  $empDesignation: "marketing",
                  $empReportingManager: "sunilee",
                  $empConnections: 10,
                  $empHobbies: [
                      "Music",
                      "Dance"
                  ],
                  $empCtc: "23",
                  $empPhoneNumber: "52164",
                  $empPersonalEmail: "div@gmail.com",
                  $empAboutMe: "i'm always cool..!",
                  $empCurrentAddress: {},
                  $empResidentialAddress: {},
                  $empBand: "12",
                  $empGraduation: "bba",
                  $empPostGraduation: "mba",
                  $empPrimaryCapability: [
                      "Communication"
                  ],
                  $empSkillSet: [
                      "Communication skill"
                  ],
                  $empCertifications: [
                      "Power Bi"
                  ],
                  $role: "APPROVER",
                  $personalDetails: [],
                  $professionalDetails: [],
                  $skillsDetails: [],
                  $slackMemId: ""
              }
        }
      }
      #swagger.responses[200] = {
        description: 'reviews updated',
        schema: {
        "status": "success",
        "data": {
            
            "reqId": 5,
            "reqName": "admadsin",
            "reqType": "profile-creation",
            "status": "pending",
            "employeeDetails": {
                "empName": "alan sajan",
                "empEmail": "sajan@mail.com",
                "empDoj": "2021-11-20T00:00:00.000Z",
                "empDob": "2021-11-20T00:00:00.000Z",
                "empDepartment": "sales",
                "empDesignation": "marketing",
                "empReportingManager": "sunilee",
                "empConnections": 10,
                "empHobbies": [
                    "Music",
                    "Dance"
                ],
                "empAboutMe": "i'm always cool..!",
                "empCurrentAddress": {},
                "empResidentialAddress": {},
                "empBand": "12",
                "empGraduation": "bba",
                "empGraduationUniversity": "",
                "empPostGraduation": "mba",
                "empPostGraduationUniversity": "",
                "empPrimaryCapability": [
                    "Communication"
                ],
                "empSkillSet": [
                    "Communication skill"
                ],
                "empCertifications": [
                    "Power Bi"
                ],
                "role": "APPROVER"
            },
            "createdAt": "2021-12-14T08:37:28.817Z",
            "updatedAt": "2021-12-14T08:39:03.363Z",
            "__v": 0
        },
        "error": {}
        }
      }

      #swagger.responses[400] = {
      description: 'Bad request',
      schema: { 
        "status": "failure",
        "code": 400,
        "message": "Bad request",
        "data":{},
        "error": {}
        }
      }
      #swagger.responses[500] = {
      description: 'Internal Server Error',
      schema: { 
        "status": "failure",
        "code": 400,
        "message": "Internal Server Error",
        "data":{},
        "error": {}
        }
      }
  */
  try {
    const { error } = reviewupdatedSchema.validate(req.body);
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

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      code = constant.HTTP_400_CODE;
      message = constant.REVIEW_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    res.status(200).json({
      status: constant.STATUS_SUCCESS,
      data: review,
    });
  } catch (err) {
    logger.error(err);
    code = constant.HTTP_400_CODE;
    message = constant.REVIEW_NOT_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { error } = reviewupdatedSchema.validate(req.body);

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

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      code = constant.HTTP_400_CODE;
      message = constant.REVIEW_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }

    const employeeData = {
      ...review.employeeDetails._doc,
    };

    // check and create employee
    if (
      review.type === "profile-creation" &&
      req.body.status === constant.STATUS_ACCEPTED
    ) {
      const newEmployee = await Employee.create(employeeData);
      if (!newEmployee) {
        await Review.findByIdAndUpdate(
          req.params.id,
          { status: constant.STATUS_PENDING },
          {
            new: true,
            runValidators: true,
          }
        );
        code = constant.HTTP_400_CODE;
        message = constant.EMPLOYEE_NOT_FOUND_MSG;
        const resData = customResponse({
          code,
          message,
          err: error,
        });
        return res.status(code).send(resData);
      }

      return res.status(constant.HTTP_200_CODE).json({
        status: constant.STATUS_SUCCESS,
        result: constant.EMPLOYEE_CREATED_MSG,
        data: review,
      });
    }

    //check and update employee
    const employeeDataToUpdate = {
      ...review.employeeDetails._doc,
    };

    if (
      review.type === "profile-update" &&
      req.body.status === constant.STATUS_ACCEPTED
    ) {
      const _id = await Employee.findOne({
        email: review.employeeDetails.email,
      }).select("_id");

      const employee = await Employee.findByIdAndUpdate(
        _id,
        employeeDataToUpdate,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!employee) {
        await Review.findByIdAndUpdate(
          req.params.id,
          { status: constant.STATUS_PENDING },
          {
            new: true,
            runValidators: true,
          }
        );
        code = constant.HTTP_400_CODE;
        message = constant.REVIEW_NOT_FOUND_MSG;
        const resData = customResponse({
          code,
          message,
          err: error,
        });
        return res.status(code).send(resData);
      }

      return res.status(constant.HTTP_200_CODE).json({
        status: constant.STATUS_SUCCESS,
        result: constant.EMPLOYEE_UPDATED_MSG,
        data: review,
      });
    }

    res.status(constant.HTTP_200_CODE).json({
      status: constant.STATUS_SUCCESS,
      data: review,
    });
  } catch (err) {
    code = constant.HTTP_400_CODE;
    message = constant.REVIEW_NOT_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
      err: error.message,
    });
    return res.status(code).send(resData);
  }
};

exports.deleteReview = async (req, res) => {
  /*
    #swagger.tags = ['Review']
    #swagger.description = 'Delete review'
    #swagger.parameters['reqId'] = {
      in: 'path',
      type: 'string',
      description: 'Review which we want to delete'
    }
    #swagger.responses[204] = {
      description: 'Review deleted successfully.',
      schema:{
    "status": "success",
    "code": 204,
    "message": "Deleted",
    "data": {
    },
    "error": {}
}
    }
      #swagger.responses[400] = {
      description: 'Bad request',
      schema: { 
        "status": "failure",
        "code": 400,
        "message": "Bad request",
        "data":{},
        "error": {}
        }
      }
      #swagger.responses[500] = {
      description: 'Internal Server Error',
      schema: { 
        "status": "failure",
        "code": 500,
        "message": "Internal Server Error",
        "data":{},
        "error": {}
        }
      }
  */
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      code = constant.HTTP_400_CODE;
      message = constant.REVIEW_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
    code = constant.HTTP_204_CODE;
    const resData = customResponse({
      code,
    });
    res.status(code).send(resData);
  } catch (err) {
    logger.error(err);
    code = constant.HTTP_400_CODE;
    message = constant.REVIEW_NOT_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};
