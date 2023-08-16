const express = require("express");
const router = express.Router();

const {
  getAllUniversities,
  searchUniversity,
} = require("./controller");

router.get("/", getAllUniversities);
router.get("/search", searchUniversity);

module.exports = router;
