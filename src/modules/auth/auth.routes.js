const express = require('express');
const AuthController = require('./auth.controller');
const AuthService = require('./auth.service');
const AuthRepository = require('./../../repositories/auth.repository');
const db = require("../../common/database");
const jwtController = require('./../../common/jwt/jwt.controller');

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtController);
const authController = new AuthController(authService);
const app = express();

const authRouter = express.Router();

authRouter.post('/signup', authController.signUpAndGiveToken);
authRouter.post('/login', authController.loginAndGiveToken);
authRouter.post('/logout', authController.logoutAndDestroyToken);
authRouter.post('/mail', authController.sendAuthMail);
authRouter.post('/mail/password', authController.sendPasswordMail);
authRouter.post('/mail/verify', authController.verifyMail);
authRouter.post('/mail/updatepw', authController.updatePassword);
authRouter.get('/refresh', authController.refreshAccessToken);
authRouter.get('/session', authController.checkUserSession);
authRouter.get('/info', authController.checkUserSession, authController.info);

module.exports = authRouter;