const express = require("express");
const controller = require("../controller/index");
const { checkUserExists } = require("../middlewares/users/emailExists");
const { verifyPayload } = require("../middlewares/users/checkPayload");
const { authenticate } = require("../middlewares/users/authenticate");
const updatePayload = require("../middlewares/users/updatePayload");
const { checkDatabaseConnection } = require("../utils/checkDatabaseConnection");

const app = express.Router();

app.use(checkDatabaseConnection);

/**
 * @swagger
 * tags:
 *   - name: Authenticated
 *     description: Operations available only to authenticated users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: "User ID"
 *         firstName:
 *           type: string
 *           description: "First name of the user"
 *         lastName:
 *           type: string
 *           description: "Last name of the user"
 *         email:
 *           type: string
 *           format: email
 *           description: "Email address of the user"
 *         password:
 *           type: string
 *           description: "Password of the user"
 *         account_created:
 *           type: string
 *           format: date-time
 *           description: "Timestamp of when the account was created"
 *         account_updated:
 *           type: string
 *           format: date-time
 *           description: "Timestamp of when the account was updated"
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided information.
 *     tags:
 *       - Public
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the user.
 *                 firstName:
 *                   type: string
 *                   description: The first name of the created user.
 *                 lastName:
 *                   type: string
 *                   description: The last name of the created user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the created user.
 *                 account_created:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when account was created.
 *                 account_updated:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when account was updated.
 *       '400':
 *         description: Bad request
 */
app.post("/", verifyPayload, checkUserExists, controller.users.createUser);

/**
 * @swagger
 * /v1/users/self:
 *   put:
 *     summary: Update user information
 *     description: Update the authenticated user's first name, last name, and email.
 *     tags:
 *       - Authenticated
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The updated first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The updated last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the user.
 *     responses:
 *       '204':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 */
app.put("/self", authenticate, updatePayload, controller.users.updateUser);

/**
 * @swagger
 * /v1/users/self:
 *   get:
 *     summary: Get user information for the authenticated user
 *     description: Retrieve information about the authenticated user.
 *     tags:
 *       - Authenticated
 *     security:
 *       - basicAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The unique identifier of the user.
 *                 firstName:
 *                   type: string
 *                   description: The first name of the user.
 *                 lastName:
 *                   type: string
 *                   description: The last name of the user.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                 account_created:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the account was created.
 *                 account_updated:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the account was updated.
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad Request
 */
app.get("/self", authenticate, controller.users.getSelfInfo);

module.exports = app;
