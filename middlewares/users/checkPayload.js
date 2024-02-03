const logger = require("../../utils/logger");

function verifyPayload(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    logger.error("Failed to create user as fields are missing");
    return res.status(400).send({ error: "Fields are missing, Try Again!" });
  }

  next();
}

module.exports = {
  verifyPayload,
};
