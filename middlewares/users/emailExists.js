const UserModel = require("../../models/User.model");
const logger = require("../../utils/logger");

async function checkUserExists(req, res, next) {
  const { email } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      where: { username: email },
    });

    if (existingUser) {
      return res.status(400).send();
    }

    next();
  } catch (error) {
    logger.error("Error checking user existence:", error);
    res.status(500).send();
  }
}

module.exports = {
  checkUserExists,
};
