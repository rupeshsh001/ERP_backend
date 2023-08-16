var cron = require("node-cron");
const { emailContent } = require("./poEmail");
const { emailSender } = require("../middleware/POMailNotification");
const Invoice = require("../modules/invoice/model");
const constant = require("../constants/constant");

const scheduler = () => {
  cron.schedule("0 0 13 * * *", async () => {
    const getDetails = await Invoice.find({}).populate(
      constant.PO_ID,
      "clientName projectName targettedResources poNumber poAmount posowEndDate"
    );
    var today = new Date();
    getDetails.map(async (data) => {
      if (data.PO_Id.posowEndDate < today) {
        const statusUpdate = await Invoice.updateOne(
          { _id: data._id },
          {
            $set: { Status: constant.STATUS_OVERDUE, updated_at: new Date() },
          }
        );

        const payload = {
          clientName: data.PO_Id.clientName,
          projectName: data.PO_Id.projectName,
          poAmount: data.PO_Id.poAmount,
          Received_Amount: data.invoice_amount_received,
          Created_On: data.created_at.toLocaleDateString(),
        };
        const content = await emailContent("N002", payload);
        emailSender(content);
      }
    });
  });
};

module.exports = { scheduler };
