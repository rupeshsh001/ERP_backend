const mongoose = require("mongoose");

const BankAccountSchema = mongoose.Schema({
  bank_account: {
    type: String,
    required: [true, "bank account is required"],
  },
});

const BankAccountModel = mongoose.model("vb_bank_account", BankAccountSchema);

module.exports = BankAccountModel;
