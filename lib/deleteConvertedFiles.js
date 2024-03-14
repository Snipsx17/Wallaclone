const fs = require("fs");

const deleteConvertedFiles = (paths) => {
  try {
    paths.forEach((path) => {
      fs.unlink(path, (err) => {
        (err) => {
          if (err) {
            console.log(err);
          }
          throw error;
        };
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = deleteConvertedFiles;
