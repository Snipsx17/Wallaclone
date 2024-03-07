require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");

const s3Config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET}
};

const s3Client = new S3Client(s3Config);

module.exports = s3Client;
