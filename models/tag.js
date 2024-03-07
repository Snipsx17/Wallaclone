const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
  {
    tag: { type: String },
  },
  {
    collection: "tags",
  }
);

const Tag = mongoose.model("Tags", tagSchema);

module.exports = Tag;
