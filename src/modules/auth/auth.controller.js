const jwtController = require('../../common/jwt/jwt.controller');
const userService = require('../user/user.service');
const authService = require('../auth/auth.service');

exports.signUpAndGiveToken = async (req, res) => {
    try {
        const user = req.body;
        await validUser(user.email);
        await authService.addUser(user);
        const { accessToken, refreshToken } = await jwtController.generateTokens(user.email, user.user_name);
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        res.status(500).send({ error: error.message });
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
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

// TODO: 다른 사람이 로그인 했을 때 강제 로그아웃
exports.forceLogout = () => { }

exports.logoutAndDestroyToken = async (req, res) => {
    const email = req.query.email;
    const result = await userService.findUserByEmail(email);
    jwtController.destroyAccessToken(req, res);
    res.status(200).json({ message: "Successfuly logout" });
}

// TODO: next 넣어서 미들웨어로 만들기
exports.checkUserSession = async (req, res) => {
    try {
        const accessToken = req.headers.Authorization;
        const refreshToken = extractRefreshTokenFromCookie(req);
        console.log("refreshToken: " + refreshToken);
        const result = await jwtController.validateToken(accessToken, refreshToken);
        console.log('Successfuly Authenticateed');
        res.status(200).json({ email: result.email });
    } catch (error) {
        res.status(500).json("토큰 없음");
    }
}

const extractRefreshTokenFromCookie = (req) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        return req.cookies.refreshToken;
    }
    throw new Error("Refresh Token이 Cookie에 존재하지 않음");
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