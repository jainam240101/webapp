const { Sequelize } = require("sequelize");
const config = require("../config/mysql");
const logger = require("../utils/logger");

const sequelize = new Sequelize(config.development);

async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync();
    logger.info("Database synchronized successfully.");
  } catch (error) {
    logger.error("Error synchronizing the database:", error);
  }
}

const testAndSync = async () => {
  await testConnection();
  await syncDatabase();
};

module.exports = {
  testAndSync,
  sequelize,
};
