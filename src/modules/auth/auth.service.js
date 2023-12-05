const cookieParser = require('../../common/jwt/cookieparser.js');
const { ErrorResponse } = require("#dongception");
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/http/responseCode');

class AuthService {
    constructor(authRepository, jwtController) {
        this.authRepository = authRepository;
        this.jwtController = jwtController;
    }

    async signUpAndGiveToken(user, res) {
        try {
            const { user_name, email, password } = user;
            if (!user_name || !email || !password) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "회원가입 입력값이 부족합니다");
            }

            await this.validUser(email);

            const insertResult = await this.authRepository.addUser(user_name, email, password);

            const { accessToken, refreshToken } = await this.jwtController.generateTokens(insertResult.insertId, email, user_name);
            if (!accessToken || !refreshToken) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, { error: "토큰 생성에 실패했습니다" });
            }

            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.status(STATUS_CODES.CREATED).json({ accessToken });
        } catch (error) {
            throw error;
        }
    }


    async loginAndGiveToken(email, password, res) {
        try {
            const result = await this.authRepository.findUserByEmailAndPassword(email, password);
            if (!result || result == '') {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, '로그인 실패. 이메일 또는 패스워드를 확인해주세요.');
            }
            const { accessToken, refreshToken } = await this.jwtController.generateTokens(result[0].id, result[0].email, result[0].user_name);
            res.cookie('refreshToken', encodeURIComponent(refreshToken), { httpOnly: true });
            res.status(STATUS_CODES.OK).json({ accessToken: accessToken });
        } catch (error) {
            throw error;
        }
    }

    async logoutAndDestroyToken(req, res) {
        try {
            await this.clearTokens(req, res);
            res.status(STATUS_CODES.OK).json({ message: "Successfuly logout" });
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).send({ error: error.message });
        }
    }

    async checkUserSession(req, res, next) {
        try {
            const accessToken = req.headers.authorization;
            const result = await this.jwtController.verifyAccessToken(accessToken);
            const { id, email, user_name } = result;
            req.user = { id, email, user_name };
            next();
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).send({ message: error.message });
        }
    }

    async refreshAccessToken(req, res) {
        const refreshToken = await this.extractFromCookie(req, 'refreshToken');
        try {
            const result = await this.jwtController.verifyRefreshToken(decodeURIComponent(refreshToken));
            res.cookie('refreshToken', encodeURIComponent(result.newRefreshToken), { httpOnly: true });
            res.status(STATUS_CODES.CREATED).json({ accessToken: result.newAccessToken });
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).send({ message: error.message });
        }
    }

    async validUser(email) {
        try {
            const result = await this.authRepository.findUserByEmail(email);
            if (result && result.length > 0) {
                throw new ErrorResponse(400, "이미 가입한 이메일입니다.");
            }
        } catch (error) {
            throw error;
        }
    }

    async clearTokens(req, res) {
        try {
            const refreshToken = await this.extractFromCookie(req, 'refreshToken');
            res.clearCookie('refreshToken');
            await this.jwtController.deleteRefreshToken(refreshToken);
        } catch (error) {
            throw error;
        }
    }

    async extractFromCookie(req, name) {
        const extracted = cookieParser.parseCookies(req.headers.cookie)[name];
        return decodeURIComponent(extracted);
    }
}

module.exports = AuthService;