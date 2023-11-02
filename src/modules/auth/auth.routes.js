const express = require('express');
const app = express();

const authController = require("./auth.controller");

const authRouter = express.Router();

authRouter.get('/login', authController.loginAndGiveToken);
authRouter.post('/logout', authController.logoutAndDestroyToken);
authRouter.get('/session', authController.checkUserSession);

module.exports = authRouter;