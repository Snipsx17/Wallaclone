const Tag = require("../models/tag");

class TagsController {
  async get(req, res, next) {
    try {
      const result = await Tag.find();
      const tags = result.map((tag) => tag.tag);
      res.json({ tags });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TagsController;
