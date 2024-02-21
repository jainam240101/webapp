require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("../config/mysql");

const sequelize = new Sequelize({
  ...config.development,
  username: "root",
  database: "mysql",
});

sequelize
  .query("CREATE DATABASE IF NOT EXISTS cloud")
  .then(() => {
    console.log("Database cloud created successfully.");
  })
  .catch((error) => {
    console.error("Error creating database:", error);
  })
  .finally(() => {
    sequelize.close();
  });
