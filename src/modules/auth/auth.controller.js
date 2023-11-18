const jwtController = require('../../common/jwt/jwt.controller');
const userService = require('../user/user.service');
const authService = require('../auth/auth.service');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/http/responseCode');

exports.signUpAndGiveToken = async (req, res) => {
    try {
        const user = req.body;
        await validUser(user.email);
        await authService.addUser(user);
        const { accessToken, refreshToken } = await jwtController.generateTokens(user.email, user.user_name);
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(STATUS_CODES.CREATED).json({ accessToken: accessToken });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
    }
}

exports.loginAndGiveToken = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.findUserByEmailAndPassword(email, password);
        if (!result || result == '') {
            throw new Error('로그인 실패. 이메일 또는 패스워드를 확인해주세요.');
        }
        const { accessToken, refreshToken } = await jwtController.generateTokens(result[0].email, result[0].user_name);
        res.cookie('refreshToken', encodeURIComponent(refreshToken), { httpOnly: true });
        res.status(STATUS_CODES.OK).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
    }
}


// TODO: 로그아웃 로직 완성
exports.logoutAndDestroyToken = async (req, res) => {
    const email = req.query.email;
    const result = await userService.findUserByEmail(email);
    res.status(STATUS_CODES.OK).json({ message: "Successfuly logout" });
}

// TODO: next 넣어서 미들웨어로 만들기
exports.checkUserSession = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        const refreshToken = req.cookies.refreshToken;

        const { email, user_name } = await jwtController.validateTokens(accessToken, refreshToken);
        res.status(STATUS_CODES.OK).json({ email: email, user_name: user_name });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
    }
}

const validUser = async (email) => {
    try {
        const result = await userService.findUserByEmail(email);
        if (result == null || result == undefined) {
            throw new Error('이미 가입한 이메일입니다.');
        }
    } catch (error) {
        throw error;
    }
}