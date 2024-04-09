const mongoose = require("mongoose");
const User = require("./user");

const advertSchema = mongoose.Schema(
  {
    name: { type: String, index: true },
    description: { type: String },
    price: { type: Number, index: true },
    status: { type: Boolean, index: true },
    image: { type: String },
    thumbnail: { type: String },
    tags: { type: [String], index: true },
    date: { type: Date, index: true},
    owner: { ref: "User", type: mongoose.Schema.Types.ObjectId, index: true },
  },
  {
    collection: "adverts",
    timestamps: true,
  }
);

advertSchema.methods.getOwnerEmail = async function() {
  const ownerId = this.owner;

  const owner = await User.findById(ownerId);
  
  return owner ? owner.email : null;
};

advertSchema.statics.list = function (filter, fields, skip, limit, sort) {
  const query = Advert.find(filter);
  query.select(fields);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  return query.exec();
};

const Advert = mongoose.model("Advert", advertSchema);

module.exports = Advert;
