const nodeEnv = process.env.NODE_ENV;
let logger = null;
const devLogger = require("./devLogger")
const prodLogger = require("./prodLogger")
if (nodeEnv !== "production") {
  logger = devLogger()
} else {
  logger = prodLogger()
}

module.exports = logger;