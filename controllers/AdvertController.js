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
    const data = req.body;
    const image = req.files.image;
    const imageName = `${generateId()}.${image.mimetype.split("/")[1]}`;

    const bucketParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageName,
      Body: image.data,
    };

    try {
      //save images on S3
      await s3Client.send(new PutObjectCommand(bucketParams));
      //generate URL
      data.image = `https://images-wallaclone.s3.amazonaws.com/${imageName}`;
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
    const advert = Advert.findById(advertId);

    if (!advert) {
      next(createError(404, "Advert not found"));
      return;
    }

    // falta comprobar si es el propietario del anuncion

    try {
      await Advert.deleteOne({ _id: advertId });
      res.json({ message: "Advert deleted" });
    } catch (error) {
      next(error);
    }
  }

  async put(req, res, next) {
    const filter = { _id: req.params.id };
    const update = req.body;

    // falta comprobar que el usuario sea el due;o del anuncio

    try {
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
