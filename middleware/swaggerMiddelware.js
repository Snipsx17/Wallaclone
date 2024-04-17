const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "Wallaclone API",
          version: "1.0.0",
          description: "Wallaclone API documentation",
        },
        servers: [
          {"url": 'https://coderstrikeback.es/'}
        ]
      },

      apis: ['./routes/doc.js']
}

  const especification = swaggerJSDoc(options);

  module.exports = [swaggerUI.serve, swaggerUI.setup(especification)]