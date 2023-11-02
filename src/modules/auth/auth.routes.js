const express = require('express');
const app = express();

const authController = require("./auth.controller");

const authRouter = express.Router();

authRouter.get('/login', authController.login);

module.exports = authRouter;