// swaggerConfig.js

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your Node.js application",
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "User ID",
          },
          firstName: {
            type: "string",
            description: "First name of the user",
          },
          lastName: {
            type: "string",
            description: "Last name of the user",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email address of the user",
          },
          account_created: {
            type: "string",
            format: "date-time",
            description: "Timestamp of when the account was created",
          },
          account_updated: {
            type: "string",
            format: "date-time",
            description: "Timestamp of when the account was updated",
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
