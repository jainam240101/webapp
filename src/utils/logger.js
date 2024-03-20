const winston = require("winston");

const transports = [
  new winston.transports.File({
    filename: "/var/log/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "/var/log/combined.log" }),
  new winston.transports.Console(),
];

const customFormat = winston.format.combine(
  winston.format.printf((info) => {
    const currentTimestamp = new Date().toISOString();
    const logMessage = {
      timestamp: currentTimestamp,
      level: info.level,
      service: "user-service",
      message: info.message,
    };
    return JSON.stringify(logMessage);
  })
);

const logger = winston.createLogger({
  level: "debug",
  format: customFormat,
  transports: transports,
});

module.exports = logger;
