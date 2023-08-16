const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();
const {
  setStatus,
  cimsGet,
  cimsPatch,
  cimsPost,
  getFilteredClients,
  getClientById,
} = require("./controller");
const { hasPermission } = require("../../middleware/auth");

router.get("/", hasPermission("view_CIMS_module"), cimsGet);
router.post("/", hasPermission("create_CIMS_module"), cimsPost);
router.patch("/", hasPermission("update_on_CIMS_module"), setStatus);
router.put("/", hasPermission("update_on_CIMS_module"), cimsPatch);

// new filter for PMO integration
router.get("/clients", hasPermission("view_CIMS_module"), getFilteredClients);
router.get("/clients/:id", hasPermission("view_CIMS_module"), getClientById);

module.exports = router;
