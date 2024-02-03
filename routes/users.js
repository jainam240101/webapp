const express = require("express");
const controller = require("../controller/index");
const { checkUserExists } = require("../middlewares/users/emailExists");
const { verifyPayload } = require("../middlewares/users/checkPayload");
const { authenticate } = require("../middlewares/users/authenticate");
const updatePayload = require("../middlewares/users/updatePayload");

const app = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User Operations APIs
 */

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided information.
 *     tags:
 *       - User
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
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *       '409':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
app.post("/", verifyPayload, checkUserExists, controller.users.createUser);

/**
 * @swagger
 * /v1/users/self:
 *   put:
 *     summary: Update user information
 *     description: Update the authenticated user's first name, last name, and email.
 *     tags:
 *       - User
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
app.put("/self", authenticate, updatePayload, controller.users.updateUser);

/**
 * @swagger
 * /v1/users/self:
 *   get:
 *     summary: Get user information for the authenticated user
 *     description: Retrieve information about the authenticated user.
 *     tags:
 *       - User
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
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
app.get("/self", authenticate, controller.users.getSelfInfo);

module.exports = app;
