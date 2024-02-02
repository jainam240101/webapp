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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The current health status.
 *                   example: "OK"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
app.get("/", emptyPayload, controller.health.checkHealth);

module.exports = app;
