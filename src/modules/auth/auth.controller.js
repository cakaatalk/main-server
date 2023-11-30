const authService = require('../auth/auth.service.js');

exports.signUpAndGiveToken = async (req, res) => {
    await authService.signUpAndGiveToken(req, res);
}

exports.loginAndGiveToken = async (req, res) => {
    await authService.loginAndGiveToken(req, res);
}

exports.logoutAndDestroyToken = async (req, res) => {
    await authService.logoutAndDestroyToken(req, res);
}

exports.checkUserSession = async (req, res, next) => {
    await authService.checkUserSession(req, res, next);
}

exports.info = async (req, res) => {
  res.send(`Welcome, ${JSON.stringify(req.user)}!`);
};

exports.refreshAccessToken = async (req, res) => {
    await authService.refreshAccessToken(req, res);
}