const filterById = (searchKeyword) => [
  {
    $lookup: {
      from: "purchase_ordertests",
      localField: "poId",
      foreignField: "_id",
      as: "purchase_orders",
    },
  },
  { $unwind: "$purchase_orders" },

  {
    $match: {
      $or: [
        {
          "purchase_orders.clientName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.projectName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientSponser": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientFinanceController": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.Type": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poNumber": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          Status: {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poAmount": parseInt(searchKeyword),
        },
      ],
    },
  },
];

const filterByInvoiceAmountReceived = (searchKeyword) => [
  {
    $lookup: {
      from: "purchase_ordertests",
      localField: "poId",
      foreignField: "_id",
      as: "purchase_orders",
    },
  },
  { $unwind: "$purchase_orders" },

  {
    $match: {
      $or: [
        {
          "purchase_orders.clientName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.projectName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientSponser": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientFinanceController": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.Type": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poNumber": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          Status: {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poAmount": parseInt(searchKeyword),
        },
      ],
    },
  },
];

const filterByClientName = (searchKeyword) => [
  {
    $lookup: {
      from: "purchase_ordertests",
      localField: "poId",
      foreignField: "_id",
      as: "purchase_orders",
    },
  },
  { $unwind: "$purchase_orders" },
  { $sort: { "purchase_orders.clientName": 1 } },
  {
    $match: {
      $or: [
        {
          "purchase_orders.clientName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.projectName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientSponser": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientFinanceController": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.Type": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poNumber": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          Status: {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poAmount": parseInt(searchKeyword),
        },
      ],
    },
  },
];

const filterByProjectName = (searchKeyword) => [
  {
    $lookup: {
      from: "purchase_ordertests",
      localField: "poId",
      foreignField: "_id",
      as: "purchase_orders",
    },
  },
  { $unwind: "$purchase_orders" },
  { $sort: { "purchase_orders.projectName": 1 } },
  {
    $match: {
      $or: [
        {
          "purchase_orders.clientName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.projectName": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientSponser": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.clientFinanceController": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.Type": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poNumber": {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          Status: {
            $regex: `${searchKeyword}`,
            $options: "i",
          },
        },
        {
          "purchase_orders.poAmount": parseInt(searchKeyword),
        },
      ],
    },
  },
];

module.exports = {
  filterById,
  filterByInvoiceAmountReceived,
  filterByClientName,
  filterByProjectName,
};
