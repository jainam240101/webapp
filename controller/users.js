const logger = require("../utils/logger");
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (req, res) => {
  try {
    logger.info(`Creating user with username ${req.body.email}`);

    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.email,
      password: hashedPassword,
    });

    logger.info(`User: ${req.body.email} successfully created`);

    res.status(201).send({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      account_created: newUser.account_created,
      account_updated: newUser.account_updated,
    });
  } catch (error) {
    logger.error(`Error : ${error.message}`);
    res.status(500).send({ error: "Error creating a user, Try Again" });
  }
};

const updateUser = async (req, res) => {
  try {
    logger.info(`Updating user with username ${req.user.username}`);
    const updateFields = {};

    if (req.body.firstName) {
      updateFields.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      updateFields.lastName = req.body.lastName;
    }

    if (req.body.password) {
      updateFields.password = await hashPassword(req.body.password);
    }

    updateFields.account_updated = new Date();

    await UserModel.update(updateFields, {
      where: { username: req.user.username },
    });
    logger.info(`Updated user with username ${req.user.username} successfully`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error : ${error.message}`);
    res.status(500).send({ error: "Error updating user data, Try Again" });
  }
};

const getSelfInfo = async (req, res) => {
  try {
    logger.info("Fetching User Data");
    const userData = await UserModel.findOne({
      where: {
        username: req.user.username,
      },
    });
    res.status(200).send({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      account_created: newUser.account_created,
      account_updated: newUser.account_updated,
    });
  } catch (error) {
    logger.error(`Error : ${error.message}`);
    res
      .status(500)
      .send({ error: "Error while fetching user data, Try Again" });
  }
};

module.exports = {
  createUser,
  getSelfInfo,
  updateUser,
  hashPassword,
};
