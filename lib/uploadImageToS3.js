const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../lib/awsS3Config");
const { imageToWebp } = require("image-to-webp");
const sharp = require("sharp");
const deleteConvertedFiles = require("../lib/deleteConvertedFiles");
const fs = require("fs");

async function uploadImagesToS3(reqFile) {
  try {
    // convert images
    const pathImageWebp = await imageToWebp(reqFile.path, 50);
    await sharp(pathImageWebp)
      .resize(200, 200)
      .toFile(`uploads/${reqFile.filename}-thumbnail-200x200.webp`);
    const pathImageThumbnail = `./uploads/${reqFile.filename}-thumbnail-200x200.webp`;

    // get images
    const imageThumbnail = fs.readFileSync(pathImageThumbnail);
    const imageWebp = fs.readFileSync(pathImageWebp);

    // prepare bucket config
    const bucketParamsWebp = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
      Key: `${reqFile.filename}.webp`,
      Body: imageWebp,
    };
    const bucketParamsThumbnail = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
      Key: `${reqFile.filename}-thumbnail-200x200.webp`,
      Body: imageThumbnail,
    };

    //save images on S3
    await s3Client.send(new PutObjectCommand(bucketParamsWebp));
    await s3Client.send(new PutObjectCommand(bucketParamsThumbnail));

    //delete files
    deleteConvertedFiles([reqFile.path, pathImageWebp, pathImageThumbnail]);

    //generate URL
    const uriImageThumbnail = `https://images-wallaclone.s3.amazonaws.com/${reqFile.filename}-thumbnail-200x200.webp`;
    const uriImageWebp = `https://images-wallaclone.s3.amazonaws.com/${reqFile.filename}.webp`;

    return { uriImageThumbnail, uriImageWebp };
  } catch (error) {
    throw error;
  }
}

module.exports = uploadImagesToS3;
