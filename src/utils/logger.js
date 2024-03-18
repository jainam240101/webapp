const winston = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");

const loggingWinston = new LoggingWinston({
  projectId: process.env.projectId,
});

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const logMessage = {
      timestamp: info.timestamp,
      level: info.level,
      service: "user-service",
      message: info.message,
    };
    return JSON.stringify(logMessage);
  })
);

const logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
    loggingWinston,
  ],
});

module.exports = logger;
