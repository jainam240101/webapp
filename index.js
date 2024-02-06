const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("./utils/logger");
const router = require("./routes/index");
const { testAndSync } = require("./utils/db");
const { allowOnlyGet } = require("./middlewares/requestChecks");

const app = express();

app.use(bodyParser.json());

(async () => {
  try {
    await testAndSync();
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
})();

app.use(cors());

app.use("/healthz", allowOnlyGet, router.health);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`Server Started on PORT ${port}`);
});
