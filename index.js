const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("./utils/logger");
const router = require("./routes/index");
const { testAndSync } = require("./utils/db");
const swaggerSpecs = require("./utils/swagger-docs");
const swaggerUi = require("swagger-ui-express");
const { allowOnlyGet } = require("./middlewares/health/requestChecks");
require("./models/index");

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
app.use("/users", router.users);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`Server Started on PORT ${port}`);
});
