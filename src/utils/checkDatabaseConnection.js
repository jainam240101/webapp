const { sequelize } = require("./db");

const checkDatabaseConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (error) {
    return res.status(503).send();
  }
};
module.exports = {
  checkDatabaseConnection,
};
