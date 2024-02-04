const express = require("express");
const controller = require("../controller/index");
const emptyPayload = require("../middlewares/health/emptyPayload");

const app = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health Check APIs
 */

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Health check successful
 *       '500':
 *         description: Internal server error
 */
app.get("/", emptyPayload, controller.health.checkHealth);

module.exports = app;
