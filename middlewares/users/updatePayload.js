const updatePayload = (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "password"];

  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    return res
      .status(400)
      .send({ error: `Invalid fields: ${extraFields.join(", ")}` });
  }

  next();
};

module.exports = updatePayload;
