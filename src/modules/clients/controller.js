const compModal = require("./model");
const { cimsSchema, updateSchema } = require("./schema");
const { customResponse } = require("../../utility/helper");
const constant = require("../../constants/constant");

//Get all records in database
const cimsGet = async (req, res) => {
  const sort = req.query.sort || "createdAt";
  const filter = req.query.filter || 1;
  const sortOrder = req.query.sortOrder || -1;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchData = req.query.searchData || "";
  const regex = new RegExp(searchData, "i");

  const filterQuery = { status: [parseInt(filter)] };
  const searchQuery = {
    $or: [
      { brandName: [regex] },
      { legalName: [regex] },
      { domain: [regex] },
      { companyType: [regex] },
      { "registeredAddress.country": [regex] },
      { "contacts.primaryContact.firstName": [regex] },
      { "contacts.primaryContact.lastName": [regex] },
      {
        "contacts.primaryContact.firstName": [
          new RegExp(searchData.split(" ")[0], "i"),
        ],
        "contacts.primaryContact.lastName": [
          new RegExp(searchData.split(" ")[1], "i"),
        ],
      },
    ],
  };

  const findQuery = { ...filterQuery, ...searchQuery };
  const sortQuery = {
    [sort.replace(/['"]+/g, "")]: sortOrder,
  };

  const fetchData = async (findQuery, sortQuery) => {
    const Comps = await compModal
      .find(findQuery)
      .collation({ locale: constant.LOCALE })
      .sort(sortQuery);
    return { Comps, count: Comps.length };
  };

  const handelPagination = (count, Comps) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(count / limit);
    const data = {};
    data.data = Comps.slice(startIndex, endIndex);
    data.data.forEach((record, i) => {
      record.no = startIndex + i + 1;
    });

    if (data.data.length == 0) {
      const startIndex = (totalPages - 1) * limit;
      const endIndex = totalPages * limit;
      data.data = Comps.slice(startIndex, endIndex);
      data.data.forEach((record, i) => {
        record.no = startIndex + i + 1;
      });
    }

    data.totalPages = totalPages;

    return data;
  };

  try {
    const { Comps, count } = await fetchData(findQuery, sortQuery);

    if (count === 0) {
      const { Comps, count } = await fetchData(filterQuery, sortQuery);

      if (count === 0) {
        code = constant.HTTP_404_CODE;
        message = `No "${
          parseInt(filter) ? constant.ACTIVE_CLIENT : constant.INACTIVE_CLIENT
        }" records exists`;

        const resData = customResponse({
          code,
          data: {},
          message,
          err: [
            {
              message,
            },
          ],
        });

        res.status(code).send(resData);
      } else {
        code = constant.HTTP_404_CODE;
        message = `No record containing "${searchData}" exists`;

        const data = handelPagination(count, Comps);
        const resData = customResponse({
          code,
          data,
          message,
          err: [
            {
              message,
            },
          ],
        });

        res.status(code).send(resData);
      }
    } else {
      const data = handelPagination(count, Comps);
      code = constant.HTTP_200_CODE;
      message = constant.DATA_FETCH_MSG;

      const resData = customResponse({
        data,
        code,
        totalResult: Comps.length,
        message,
      });
      res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      error: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

//Post record in database
const cimsPost = async (req, res) => {
  try {
    const { error } = cimsSchema.validate(req.body);

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
    const newComp = await compModal.create(req.body);
    const brandName = req.body.brandName;

    data = newComp;
    code = constant.HTTP_201_CODE;
    message = `Client with Brand name "${brandName}" added successfully`;

    const resData = customResponse({
      data,
      code,
      message,
    });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      error: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

const setStatus = async (req, res) => {
  const { id, brandName } = req.query;
  const status = parseInt(req.query.status);

  try {
    await compModal.findOneAndUpdate({ _id: id }, { status: !status });

    code = constant.HTTP_200_CODE;
    status
      ? (message = `Client with Brand name "${brandName}" has been Deactivated`)
      : (message = `Client with Brand name "${brandName}" has been Reactivated`);

    const resData = customResponse({
      code,
      message,
    });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.SERVER_ERR;

    const resData = customResponse({
      code,
      message,
      error: error && error.details,
    });
    return res.status(code).send(resData);
  }
};

//Update record in database
const cimsPatch = async (req, res) => {
  const _id = req.body._id;

  try {
    const { error } = updateSchema.validate(req.body);
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

    await compModal.findOneAndUpdate({ _id: _id }, req.body);
    const brandName = req.body.brandName;

    code = constant.HTTP_200_CODE;
    data = req.body;
    message = `Client with Brand name "${brandName}" updated successfully`;

    const resData = customResponse({
      code,
      message,
      data,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.SERVER_ERR;
    const resData = customResponse({
      code,
      message,
      error: error && error.details,
    });
    res.status(code).send(resData);
  }
};

/* ****************************************** */
// PMO integration functionality

const getFilteredClients = async (req, res) => {
  let code, message, resData;
  const query = req.query;
  try {
    if (Object.keys(req.query).length === 0) {
      const client = await compModal.find(
        { status: 1 },
        {
          _id: 1,
          brandName: 1,
          domain: 1,
          "contacts.primaryContact.firstName": 1,
          "contacts.primaryContact.lastName": 1,
          "contacts.primaryContact.contactNumber": 1,
          "contacts.secondaryContact.firstName": 1,
          "contacts.secondaryContact.lastName": 1,
          "contacts.secondaryContact.contactNumber": 1,
          "contacts.tertiaryContact.firstName": 1,
          "contacts.tertiaryContact.lastName": 1,
          "contacts.otherContact1.firstName": 1,
          "contacts.otherContact1.lastName": 1,
          "contacts.otherContact2.firstName": 1,
          "contacts.otherContact2.lastName": 1,
        }
      );
      code = constant.HTTP_200_CODE;
      message = constant.GET_FILTERED_CLIENTS_SUCCESS;
      resData = customResponse({ code, message, data: client });
      return res.status(code).send(resData);
    } else {
      const client = await compModal.find(
        {
          $or: [
            {
              brandName: {
                $regex: query.brandName.trim(),
                $options: "i",
              },
            },
          ],
          status: 1,
        },
        {
          _id: 1,
          brandName: 1,
          domain: 1,
          "contacts.primaryContact.firstName": 1,
          "contacts.primaryContact.lastName": 1,
          "contacts.primaryContact.contactNumber": 1,
          "contacts.secondaryContact.firstName": 1,
          "contacts.secondaryContact.lastName": 1,
          "contacts.secondaryContact.contactNumber": 1,
          "contacts.tertiaryContact.firstName": 1,
          "contacts.tertiaryContact.lastName": 1,
          "contacts.otherContact1.firstName": 1,
          "contacts.otherContact1.lastName": 1,
          "contacts.otherContact2.firstName": 1,
          "contacts.otherContact2.lastName": 1,
        }
      );
      code = constant.HTTP_200_CODE;
      message = constant.GET_FILTERED_CLIENTS_SUCCESS;
      resData = customResponse({ code, message, data: client });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_422_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};

const getClientById = async (req, res) => {
  let code, message, resData;
  try {
    const _id = req.params.id;
    const client = await compModal.find({ _id: _id });
    code = constant.HTTP_200_CODE;
    message = constant.GET_CLIENT_ID_SUCCESS;
    resData = customResponse({ code, message, data: client });
    res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SERVER_ERR;
    resData = customResponse({ code, message });
    res.status(code).send(resData);
  }
};
/* ****************************************** */

module.exports = {
  setStatus,
  cimsGet,
  cimsPatch,
  cimsPost,
  getFilteredClients,
  getClientById,
};
