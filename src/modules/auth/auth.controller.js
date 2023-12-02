const BaseController = require('../../common/dongpring/baseController.js');
class AuthController extends BaseController {
    constructor(authService) {
        super();
        this.authService = authService;
    }

    async signUpAndGiveToken(req, res) {
        const user = req.body;
        return await this.authService.signUpAndGiveToken(user, res);
    }

    async loginAndGiveToken(req, res) {
        const { email, password } = req.body;
        await this.authService.loginAndGiveToken(email, password, res);
    }

    async logoutAndDestroyToken(req, res) {
        await this.authService.logoutAndDestroyToken(req, res);
    }

    async checkUserSession(req, res, next) {
        await this.authService.checkUserSession(req, res, next);
    }

    async info(req, res) {
        res.send(`Welcome, ${JSON.stringify(req.user)}!`);
    };

    async refreshAccessToken(req, res) {
        await this.authService.refreshAccessToken(req, res);
    }
}

module.exports = AuthController;