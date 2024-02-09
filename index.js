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
const { checkDatabaseConnection } = require("./utils/checkDatabaseConnection");
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
app.use("/v1/users", router.users);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((_, res) => {
  res.status(404).send();
});

const port = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";
console.log(HOST);
app.listen(port, HOST, () => {
  logger.info(`Server Started on PORT ${port}`);
});
