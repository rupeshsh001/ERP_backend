require("dotenv").config();
const DB = process.env.MONGO_URL;
const logger = require("./logger/baseLogger");
const mongoose = require("mongoose");
const db = mongoose.connection;

const connectToDb = () => {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db.on("error", () => {
    logger.error("DB Connection error")
  });
  db.on("open", () => {
    logger.info("DB Connected")
  });
  db.on("close", () => {
    logger.info("DB Connection closed")
  });
};

const closeConnection = () => {
  db.close();
};

module.exports = { connectToDb, closeConnection };
