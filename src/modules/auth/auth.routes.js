const express = require('express');
const app = express();

const authController = require("./auth.controller");

const authRouter = express.Router();

authRouter.post('/signup', authController.signUpAndGiveToken);
authRouter.post('/login', authController.loginAndGiveToken);
authRouter.post('/logout', authController.checkUserSession, authController.logoutAndDestroyToken);
authRouter.get('/refresh', authController.refreshAccessToken);
authRouter.get('/session', authController.checkUserSession);
authRouter.get('/info', authController.checkUserSession, authController.info);

module.exports = authRouter;