const atob = require("atob");
const logger = require("../../utils/logger");
const UserModel = require("../../models/User.model");
const bcrypt = require("bcryptjs");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Invalid or missing Basic Authentication header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials).split(":");
    const [email, password] = credentials;

    if (!email) {
      return res
        .status(401)
        .json({ error: "Invalid Basic Authentication credentials" });
    }

    const user = await UserModel.findOne({
      where: { username: email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    logger.info("User authenticated successfully");
    req.user = user.dataValues;
    next();
  } catch (error) {
    res.status(500).send({ error: "Something went wrong, Try again!" });
  }
};

module.exports = { authenticate };
