const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});
const s3Config = {
  apiVersion: process.env.AWS_API_VERSION,
};
const s3 = new AWS.S3(s3Config);
module.exports = s3;
