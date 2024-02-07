const updatePayload = (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "password"];

  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    return res.status(400).send();
  }

  next();
};

module.exports = updatePayload;
