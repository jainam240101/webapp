const UserModel = require("../../models/User.model");
const logger = require("../../utils/logger");

async function checkUserExists(req, res, next) {
  const { email } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      where: { username: email },
    });

    if (existingUser) {
      throw new Error("User Already exists");
    }

    next();
  } catch (error) {
    logger.error("Error checking user existence:", error);
    res.status(400).send();
  }
}

module.exports = {
  checkUserExists,
};
