const { config } = require("dotenv");
const fs = require("fs");
const swaggerAutogen = require("swagger-autogen")();
const { SWAGGER } = require("./src/utility/swaggerConstants");
config();

const doc = {
  SWAGGER,
};

let outputFile = "./public/api-docs/swagger-output.json";
if (!fs.existsSync(outputFile)) {
  outputFile = fs.openSync(outputFile, "w");
}
const endpointsFiles = ["./src/routes/index.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
