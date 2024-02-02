const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
  },
  {
    tableName: "users",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
);

logger.info("User Table Sync completed");

module.exports = User;
