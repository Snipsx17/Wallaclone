require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: "us-east-1",
};

const s3Client = new S3Client(s3Config);

module.exports = s3Client;
