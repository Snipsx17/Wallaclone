const Advert = require("../models/advert");
const User = require("../models/user");
const createError = require("http-errors");
const uploadImagesToS3 = require("../lib/uploadImageToS3");
("");
const mongoose = require("mongoose");

class AdvertController {
  async get(req, res, next) {
    try {
      const name = req.query.name;
      const description = req.query.description;
      const status = req.query.status;
      const tags = req.query.tags;
      const skip = req.query.skip;
      const limit = req.query.limit;
      const sort = req.query.sort;
      const fields = req.query.fields;
      const priceMin = req.query.priceMin;
      const priceMax = req.query.priceMax;

      const filter = getFilter(name, description, status, tags, priceMin, priceMax);

      const adverts = await Advert.list(filter, fields, skip, limit, sort);
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

  async getAdvertsUser(req, res, next) {
    const userId = req.userId.userId;
    const response = {};

    try {
      response.user = await User.findById(userId).select({ password: 0 });
      response.adverts = await Advert.find({
        owner: new mongoose.Types.ObjectId(userId),
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async post(req, res, next) {
    try {
      const data = req.body;
      data.owner = req.userId.userId;

      if (req.file) {
        const { uriImageThumbnail, uriImageWebp } = await uploadImagesToS3(
          req.file
        );
        data.image = uriImageWebp;
        data.thumbnail = uriImageThumbnail;
      } else {
        data.image = process.env.PATH_PRODUCT_IMAGE_PLACEHOLDER;
        data.thumbnail = process.env.PATH_PRODUCT_IMAGE_THUMBNAIL_PLACEHOLDER;
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
        next(createError(401, "Error updating advert"));
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

const getFilter = (name, description, status, tags, priceMin, priceMax) => {
  const filter = {};

  if (name && description) {
    filter.$or = [
      { name: new RegExp("^" + name, "i") },
      { description: new RegExp(description, "i") },
    ];
  } else {
    if (name) filter.name = new RegExp("^" + name, "i");
    if (description) filter.description = new RegExp(description, "i");
  }

  if (priceMin && priceMax) {
    filter.$and = [
        {
          price: {
            $gt: priceMin,
          },
        },
        {
          price: {
            $lte: priceMax,
          },
        },
    ]
  }

  if (status) filter.status = status;
  if (tags) filter.tags = tags;

  return filter;
};

module.exports = AdvertController;
