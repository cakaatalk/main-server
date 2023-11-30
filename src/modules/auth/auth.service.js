const jwtController = require('../../common/jwt/jwt.controller');
const cookieParser = require('../../common/jwt/cookieparser.js');
const userService = require('../user/user.service');
const authRepository = require('../../repositories/auth.repository');
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/http/responseCode');

exports.signUpAndGiveToken = async (req, res) => {
    try {
        const user = req.body;
        await validUser(user.email);
        await authRepository.addUser(user);
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
        const result = await authRepository.findUserByEmailAndPassword(email, password);
        console.log(result);
        if (!result || result == '') {
            throw new Error('로그인 실패. 이메일 또는 패스워드를 확인해주세요.');
        }
        const { accessToken, refreshToken } = await jwtController.generateTokens(result[0].id, result[0].email, result[0].user_name);
        res.cookie('refreshToken', encodeURIComponent(refreshToken), { httpOnly: true });
        res.status(STATUS_CODES.OK).json({ accessToken: accessToken });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
    }
}

exports.logoutAndDestroyToken = async (req, res) => {
    try {
        await clearTokens(req, res);
        res.status(STATUS_CODES.OK).json({ message: "Successfuly logout" });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
    }
}

exports.checkUserSession = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        const result = await jwtController.verifyAccessToken(accessToken);
        const { id, email, user_name } = result;
        req.user = { id, email, user_name };
        next();
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: error.message });
    }
}

exports.refreshAccessToken = async (req, res) => {
    const refreshToken = await extractFromCookie(req, 'refreshToken');
    try {
        const result = await jwtController.verifyRefreshToken(refreshToken);
        res.cookie('refreshToken', encodeURIComponent(result.newRefreshToken), { httpOnly: true });
        res.status(STATUS_CODES.CREATED).json({ accessToken: result.newAccessToken });
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: error.message });
    }
}

const validUser = async (email) => {
    try {
        const result = await userService.findUserByEmail(email);
        if (result && result.length > 0) {
            throw new Error('이미 가입한 이메일입니다.');
        }
    } catch (error) {
        throw error;
    }
}

const clearTokens = async (req, res) => {
    try {
        const refreshToken = extractFromCookie(req, 'refreshToken');
        res.clearCookie('refreshToken');
        await jwtController.deleteRefreshToken(refreshToken);
    } catch (error) {
        throw error;
    }
}

const extractFromCookie = async (req, name) => {
    const extracted = cookieParser.parseCookies(req.headers.cookie)[name];
    return decodeURIComponent(extracted);
}