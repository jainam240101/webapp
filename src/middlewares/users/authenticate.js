const atob = require("atob");
const logger = require("../../utils/logger");
const UserModel = require("../../models/User.model");
const bcrypt = require("bcryptjs");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.error(`No Auth Header passed`);
      return res.status(401).send();
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials).split(":");
    const [email, password] = credentials;

    if (!email || !password) {
      logger.error(`Email ID or Password is not present`);
      return res.status(401).send();
    }

    const user = await UserModel.findOne({
      where: { username: email },
    });

    if (!user) {
      logger.error(`No User with the email ${email} is present`);
      return res.status(401).send();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.error(`Passwords Do not match`);
      return res.status(401).send();
    }
    if (!user.dataValues.verified) {
      logger.error("User is not verified");
      return res.status(403).send();
    }
    logger.debug("User authenticated successfully");
    logger.info("User authenticated successfully");
    req.user = user.dataValues;
    next();
  } catch (error) {
    logger.error(`Could Not Authenticate, ${error}`);
    res.status(401).send();
  }
};

module.exports = { authenticate };
