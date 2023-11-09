const jwtController = require('../../common/jwt/jwt.controller');
const userService = require('../user/user.service');

exports.signUpAndGiveToken = async (req, res) => {
    try {
        const { email, password } = req.body;

    }
}

exports.loginAndGiveToken = async (req, res) => {
    try {
        const email = req.query.email;
        const result = await userService.findUserByEmail(email);
        const accessToken = jwtController.generateAccessToken(result[0].email);
        res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        console.error('Error occurred while finding user by email:', error);
        res.status(500).json({ error: 'Internal server error' });
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
        const accessToken = req.headers.authorization;
        const refreshToken = extractRefreshTokenFromCookie(req);
        const result = await jwtController.validateToken(accessToken, refreshToken);
        console.log('Successfuly Authenticateed');
        res.status(200).json({ email: result.email });
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

// Http Only Cookie에서 RefreshToken을 가져오는 함수
function extractRefreshTokenFromCookie(req) {
    // TODO: Http Only Cookie에서 RefreshToken을 가져오는 로직을 작성해주세요.
    // 쿠키에서 RefreshToken을 추출하고 반환해야 합니다.
    return req.cookies.refreshToken;
}
