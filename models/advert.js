const mongoose = require('mongoose')

const advertSchema = mongoose.Schema({
  name: { type: String, index: true },
  description: { type: String },
  price: { type: Number, index: true },
  status: { type: Boolean, index: true },
  image: { type: String },
  tags: { type: [String], index: true },
  owner: { ref: "User", type: mongoose.Schema.Types.ObjectId, index: true },
},
{
  collection: 'adverts',
});

advertSchema.statics.list = function (name, fields, skip, limit, sort) {
  const query = Advert.find(name);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Advert = mongoose.model("Advert", advertSchema);

module.exports = Advert;
