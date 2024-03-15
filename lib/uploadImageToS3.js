const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../lib/awsS3Config");
const { imageToWebp } = require("image-to-webp");
const deleteConvertedFiles = require("../lib/deleteConvertedFiles");
const fs = require("fs");

async function uploadImageToS3(reqFile) {
  try {
    const imageName = reqFile.filename + ".webp";
    const imageConverted = await imageToWebp(reqFile.path, 50);
    const body = fs.readFileSync(imageConverted);
    const bucketParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageName,
      Body: body,
    };
    //save images on S3
    await s3Client.send(new PutObjectCommand(bucketParams));
    //delete files
    deleteConvertedFiles([reqFile.path, imageConverted]);
    //generate URL
    imagePathS3 = `https://images-wallaclone.s3.amazonaws.com/${imageName}`;

    return imagePathS3;
  } catch (error) {
    throw error
  }
}

module.exports = uploadImageToS3;
