module.exports = SWAGGER = {
  info: {
    title: process.env.APP_NAME,
    description: process.env.APP_INFO,
  },
  host: process.env.URL,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "Endpoints",
    },
  ],
  securityDefinitions: {
    Authorization: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "authorization token",
    },
  },
};
