const express = require("express");
const { hasPermission } = require("../../middleware/auth");
const {
  getRelatedInvoices,
  getBankAccount,
  getInvoiceDetails,
  getInvoiceDetailsById,
  newInvoice,
  updateInvoice,
} = require("./controller");

const router = express.Router();

router.get("/", hasPermission("view_invoice"), getRelatedInvoices);

router.get("/account", hasPermission("view_invoice"), getBankAccount);

router.get("/sort/:data", hasPermission("view_invoice"), getInvoiceDetails);

router.get("/:id", hasPermission("view_invoice"), getInvoiceDetailsById);

router.post("/", hasPermission("upload_invoice"), newInvoice);

router.patch("/:id", hasPermission("upload_invoice"), updateInvoice);

module.exports = router;
