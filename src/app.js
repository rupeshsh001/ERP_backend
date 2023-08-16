const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const constants = require("./utility/constant");
const { connectToDb } = require("./utility/db");
const router = require("./routes");
const swaggerFile = require("../public/api-docs/swagger-output.json");
const globalErrorHandler = require("./middleware/errorMiddleware");
const { scheduler } = require("./utility/jobScheduler");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { customResponse } = require("./utility/helper");
const constant = require("./constants/constant");

require("dotenv").config();

const port = process.env.PORT || 4000;
const nodeEnv = process.env.NODE_ENV;

const logger = require("./utility/logger/baseLogger");
logger.info("| ----------------------------------------------------------------- |")
logger.info("| ----------------------------------------------------------------- |")
logger.info("| -----------------      Welcome to Oneplace      ----------------- |")
logger.info("| ----------------------------------------------------------------- |")
logger.info("| ----------------------------------------------------------------- |")

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 20 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: constant.TOO_MANY_REQUEST_MSG,
});

const app = express();
app.use(helmet());

app.use(cors());
app.use(morgan(process.env.APP_MORGAN_ENV));
app.use("/api", limiter);
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "./../public")));
app.use(mongoSanitize());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api", router);

if (nodeEnv === constant.DEV)
  app.use(
    "/api/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, constants.SWAGER_OPTIONS)
  );
else
  app.get("/api/swagger", (req, res) => {
    code = 404;
    message = constant.NOT_FOUND_MSG;
    const resData = customResponse({
      code,
      message,
    });
    res.status(code).send(resData);
  });
app.use(globalErrorHandler);

app.listen(port, async () => {
  logger.info(`lisenting on port:${port}`);
  connectToDb();
  scheduler();
});

module.exports = app;
