const logger = require("../utils/logger");
const { sequelize } = require("../utils/db");

const checkHealth = async (req, res) => {
  try {
    logger.info("Checking health endpoint");

    await sequelize.authenticate();
    logger.info("MySQL Connection successful");

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).send({ message: "All Good " });
  } catch (error) {
    logger.error("Error in Health Check ", error);
    res.setHeader("Cache-Control", "no-cache");
    res.status(503).send();
  }
};

module.exports = {
  checkHealth,
};
