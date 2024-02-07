const express = require("express");
const controller = require("../controller/index");
const emptyPayload = require("../middlewares/health/emptyPayload");

const app = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Public
 *     description: Operations available to all users without authentication
 */

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '200':
 *         description: Health check successful
 *       '500':
 *         description: Internal server error
 *   post:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '405':
 *         description: Server responds with 405 Method Not Allowed.
 *   put:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '405':
 *         description: Server responds with 405 Method Not Allowed.
 *   delete:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '405':
 *         description: Server responds with 405 Method Not Allowed.
 *   head:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '405':
 *         description: Server responds with 405 Method Not Allowed.
 *   options:
 *     summary: Check health status
 *     description: Retrieve the health status of the application.
 *     tags:
 *       - Public
 *     responses:
 *       '405':
 *         description: Server responds with 405 Method Not Allowed.
 */
app.get("/", emptyPayload, controller.health.checkHealth);

module.exports = app;
