const express = require("express");
const router = express.Router();
const {
  duplicates,
  getLocation,
  getCountriesList,
  getClientInfo,
  getReport,
  checkLegalName,
} = require("./controller");

router.get("/location", getLocation);
router.get("/countries", getCountriesList);
router.get("/client", getClientInfo);
router.get("/duplicates", duplicates);
router.get("/legalname", checkLegalName);
router.get("/report", getReport);

module.exports = router;
