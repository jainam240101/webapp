const logger = require("../../utils/logger");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^.{6,}$/;
  return passwordRegex.test(password);
}

function verifyPayload(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    logger.error("Failed to create user as fields are missing");
    return res.status(400).send();
  }

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).send();
  }

  next();
}

module.exports = {
  verifyPayload,
};
