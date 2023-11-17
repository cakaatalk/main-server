const express = require('express');
const app = express();

const authController = require("./auth.controller");

const authRouter = express.Router();

authRouter.post('/signup', authController.signUpAndGiveToken);
authRouter.post('/login', authController.loginAndGiveToken);
authRouter.post('/logout', authController.logoutAndDestroyToken);
authRouter.get('/session', authController.checkUserSession);

module.exports = authRouter;