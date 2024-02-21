const atob = require("atob");
const logger = require("../../utils/logger");
const UserModel = require("../../models/User.model");
const bcrypt = require("bcryptjs");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send();
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials).split(":");
    const [email, password] = credentials;

    if (!email || !password) {
      return res.status(401).send();
    }

    const user = await UserModel.findOne({
      where: { username: email },
    });

    if (!user) {
      return res.status(401).send();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send();
    }
    logger.info("User authenticated successfully");
    req.user = user.dataValues;
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = { authenticate };
