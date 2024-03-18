const allowOnlyGet = (req, res, next) => {
  if (req.method !== "GET") {
    logger.error("Only Get methods allowed");
    return res.status(405).send();
  }
  next();
};

module.exports = { allowOnlyGet };
