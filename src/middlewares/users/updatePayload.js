const updatePayload = (req, res, next) => {
  const disallowedFields = ["username", "account_created", "account_updated"];

  const extraFields = Object.keys(req.body).filter((field) =>
    disallowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    logger.error("Incorrect payload to update a user")
    return res.status(400).send();
  }

  next();
};

module.exports = updatePayload;
