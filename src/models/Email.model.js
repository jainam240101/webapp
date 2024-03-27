const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const logger = require("../utils/logger");

const Email = sequelize.define(
  "emails",
  {
    token: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "email",
    timestamps: false,
  }
);

logger.info("Email Table Sync completed");

module.exports = Email;
