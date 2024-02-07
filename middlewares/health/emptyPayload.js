const emptyPayload = (req, res, next) => {
  if (
    Object.keys(req.body).length !== 0 ||
    Object.keys(req.query).length !== 0
  ) {
    return res.status(400).send();
  }
  next();
};
module.exports = emptyPayload;
