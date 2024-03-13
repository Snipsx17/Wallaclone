const { PutObjectCommand } = require("@aws-sdk/client-s3");
const Advert = require("../models/advert");
const createError = require("http-errors");
const s3Client = require("../lib/awsS3Config");
const { v4: generateId } = require("uuid");

class AdvertController {
  async get(req, res, next) {
    try {
      const nameFilter = req.query.name;
      const statusFilter = req.query.status;
      const tagsFilter = req.query.tags;
      const skip = req.query.skip;
      const limit = req.query.limit;
      const sort = req.query.sort;
      const fields = req.query.fields;

      const filter = {};

      if (nameFilter) filter.name = new RegExp("^" + nameFilter, "i");
      if (statusFilter) filter.status = statusFilter;
      if (tagsFilter) filter.tags = tagsFilter;

      const adverts = await Advert.list(filter, skip, limit, sort, fields);
      res.json(adverts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await Advert.findById(id);

      response
        ? res.json(response)
        : next(createError(404, "Advert not found"));
    } catch (error) {
      next(createError(404, "Advert not found"));
    }
  }

  async post(req, res, next) {
    try {
      const data = req.body;
      data.owner = req.userId.userId;

      if (req.files) {
        const image = req.files.image;
        const imageName = `${generateId()}.${image.mimetype.split("/")[1]}`;
        const bucketParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: imageName,
          Body: image.data,
        };
        //save images on S3
        await s3Client.send(new PutObjectCommand(bucketParams));
        //generate URL
        data.image = `https://images-wallaclone.s3.amazonaws.com/${imageName}`;
      } else {
        data.image = process.env.PATH_PRODUCT_IMAGE_PLACEHOLDER;
      }

      // create advert
      const newAdvert = Advert(data);
      const saveAdvert = await newAdvert.save();
      res.send(saveAdvert);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const advertId = req.params.id;
    const userId = req.userId.userId;

    try {
      const advert = await Advert.findById(advertId);

      if (!advert) {
        next(createError(404, "Advert not found"));
        return;
      }

      if (String(advert.owner) !== userId) {
        console.warn(
          `user ${userId} try to delete the advert ${advertId} without being the owner`
        );
        next(createError(401, "Error deleting advert"));
        return;
      }

      await Advert.deleteOne({ _id: advertId });
      res.json({ message: "Advert deleted" });
    } catch (error) {
      next(error);
    }
  }

  async put(req, res, next) {
    const advertId = req.params.id;
    const userId = req.userId.userId;
    const filter = { _id: advertId };
    const update = req.body;

    try {
      const advert = await Advert.findById(advertId);

      if (!advert) {
        next(createError(404, "Advert not found"));
        return;
      }

      if (String(advert.owner) !== userId) {
        console.warn(
          `user ${userId} try to update the advert ${advertId} without being the owner`
        );
        next(createError(401, "Error updating advert" ));
        return;
      }

      const advertUpdated = await Advert.findOneAndUpdate(filter, update, {
        new: true,
      });
      res.json(advertUpdated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdvertController;
