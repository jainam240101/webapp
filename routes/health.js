const express = require("express");
const controller = require("../controller/index");
const emptyPayload = require("../middlewares/emptyPayload");

const app = express.Router();

app.get("/", emptyPayload, controller.health.checkHealth);

module.exports = app;
