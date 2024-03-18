const logger = require("../../utils/logger");

const emptyPayload = (req, res, next) => {
  if (
    Object.keys(req.body).length !== 0 ||
    Object.keys(req.query).length !== 0
  ) {
    logger.error("Payload should be empty")
    return res.status(400).send();
  }
  next();
};
module.exports = emptyPayload;
