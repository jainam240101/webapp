const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db"); // Import your Sequelize instance
const logger = require("../utils/logger"); // Import your logger module

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
  },
  {
    tableName: 'users',
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
    hooks: {
      beforeUpdate: (user, options) => {
        user.updated_at = new Date();
      },
    },
  }
);

logger.info("User Table Sync completed");

module.exports = User;
