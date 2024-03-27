const logger = require("../utils/logger");
const UserModel = require("../models/User.model");
const EmailModel = require("../models/Email.model");
const bcrypt = require("bcryptjs");
const { publishMessage } = require("../utils/pubSub");

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
    logger.debug("Creating a user");
    logger.info(`Creating user with username ${req.body.email}`);

    const hashedPassword = await hashPassword(req.body.password);
    logger.warn("Creating a user");
    const newUser = await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.email,
      password: hashedPassword,
    });

    logger.info("Publishing message to Google pub sub");
    const messageID = await publishMessage({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

    logger.info(`Message published with ID ${messageID}`);
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
    logger.debug("Failed to create a user");
    logger.error(`Failed to create a user : ${error.message}`);
    res.status(400).send();
  }
};

const updateUser = async (req, res) => {
  try {
    logger.debug("Updating user details");
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
    logger.debug("Failed to update a user");
    logger.error(`Failed to update user : ${error.message}`);
    res.status(400).send();
  }
};

const getSelfInfo = async (req, res) => {
  try {
    logger.debug("Getting User Details");
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
      account_created: userData.account_created,
      account_updated: userData.account_updated,
    });
  } catch (error) {
    logger.debug("Failed to get a user");
    logger.error(`Failed to get self information : ${error.message}`);
    res.status(400).send();
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.query.token;
    const emailData = await EmailModel.findOne({
      where: {
        token,
      },
    });
    if (!emailData) {
      throw new Error("Token not valid");
    }
    const currentTime = new Date();
    let difference = currentTime - emailData.expiry;

    if (difference > 120000) {
      throw new Error("Token Expired");
    }

    const updateFields = {
      verified: true,
    };
    await UserModel.update(updateFields, {
      where: { username: emailData.email },
    });
    logger.info("User has been successfully verified");
    res.status(200).send();
  } catch (error) {
    logger.debug("Failed to Verify a user");
    logger.error(`Failed to Verify user : ${error.message}`);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  createUser,
  getSelfInfo,
  updateUser,
  hashPassword,
  verifyUser,
};
