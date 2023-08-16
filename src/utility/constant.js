module.exports = Object.freeze({
  SWAGER_OPTIONS: {
    customCss: `
        .swagger-ui .topbar {
          background-color: #ffffff;
          padding: 10px 0;
        }
        .topbar-wrapper .link:after {
          content: url(${process.env.API_STATIC}/asset/logo.svg);
          width: 240px !important;
          display: flex;
        }
        .topbar-wrapper img[alt="Swagger UI"], .topbar-wrapper span {
        visibility: collapse;
        display: none !important;
        }
      `,
  },
});

const DBModels = {
  assignee: "Assignee_New",
};

module.exports = Status = {
  drafted: ["Pending"],
  pending: ["Approved", "Rejected"],
  approved: [],
  rejected: [],
  DBModels,
};
