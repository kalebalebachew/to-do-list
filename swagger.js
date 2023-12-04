const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Kaleb's to-do-list API",
      version: '1.0.0',
      description: 'API documentation for my to do list app',
    },
  },
  apis: ['./index.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
