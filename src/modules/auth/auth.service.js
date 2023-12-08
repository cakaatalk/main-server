const cookieParser = require('../../common/jwt/cookieparser.js');
const emailService = require('../auth/auth.email.js');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { ErrorResponse } = require("#dongception");
const { STATUS_CODES, STATUS_MESSAGES } = require('../../common/http/responseCode');

class AuthService {
    constructor(authRepository, jwtController) {
        this.authRepository = authRepository;
        this.jwtController = jwtController;
    }

    async sendAuthMail(email, res) {
        try {
            await this.validUser(email);
            await this.authRepository.deleteAuthCode(email);
            const authCode = await emailService.sendAuthMail(email);
            await this.authRepository.addAuthCode(email, authCode);
            res.status(STATUS_CODES.OK).json({ message: "Successfuly Send Email" });
        } catch (error) {
            throw error;
        }
    }

    async sendPasswordMail(email, res) {
        try {
            await this.existUser(email);
            await this.authRepository.deleteAuthCode(email);
            const authCode = await emailService.sendFindMail(email);
            await this.authRepository.addAuthCode(email, authCode);
            res.status(STATUS_CODES.OK).json({ message: "Successfuly Send Email" });
        } catch (error) {
            throw error;
        }
    }

    async verifyMail(email, authCode, res) {
        try {
            if (!authCode) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "인증번호 입력값이 없습니다.");
            }
            if (!email) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 입력값이 없습니다.");
            }
            const dbAuthCode = await this.authRepository.getAuthCode(email);
            if (dbAuthCode.length == 0) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "인증번호를 먼저 전송해주세요.");
            }
            if (authCode === dbAuthCode[0].auth_code) {
                await this.authRepository.setVerity(email);
                res.status(STATUS_CODES.OK).json({ message: "Successfuly Verified Email" });
            } else {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "인증번호가 일치하지 않습니다.");
            }
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(email, password, res) {
        try {
            const result = await this.authRepository.getVerity(email);
            if (!result || result.length == 0) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 인증을 해주세요.");
            }
            if (!result[0].verified) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 인증번호를 통해 인증해주세요.");
            }

            const encryptedPassword = await this.encodePassword(password);
            const updateResult = await this.authRepository.updateUserPassword(email, encryptedPassword);

            await this.authRepository.deleteAuthCode(email);
            res.status(STATUS_CODES.OK).json({ message: '비밀번호 변경 완료' });
        } catch (error) {
            throw error;
        }
    }

    async signUpAndGiveToken(user, res) {
        try {
            const { user_name, email, password } = user;
            if (!user_name || !email || !password) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "회원가입 입력값이 부족합니다.");
            }

            const emailPattern = /@ajou\.ac\.kr$/;
            if (!email || !emailPattern.test(email)) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "올바른 이메일 형식이 아닙니다.");
            }

            await this.validUser(email);

            const result = await this.authRepository.getVerity(email);
            if (!result || result.length == 0) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 인증을 해주세요.");
            }
            if (!result[0].verified) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이메일 인증번호를 통해 인증해주세요.");
            }
            const encryptedPassword = await this.encodePassword(password);
            const insertResult = await this.authRepository.addUser(user_name, email, encryptedPassword);

            const { accessToken, refreshToken } = await this.jwtController.generateTokens(insertResult.insertId, email, user_name);
            if (!accessToken || !refreshToken) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, { error: "토큰 생성에 실패했습니다" });
            }

            await this.authRepository.deleteAuthCode(email);
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.status(STATUS_CODES.CREATED).json({ accessToken });
        } catch (error) {
            throw error;
        }
    }


    async loginAndGiveToken(email, password, res) {
        try {
            const encryptedPassword = await this.encodePassword(password);
            const result = await this.authRepository.findUserByEmailAndPassword(email, encryptedPassword);
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
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "이미 가입한 이메일입니다.");
            }
        } catch (error) {
            throw error;
        }
    }

    async existUser(email) {
        try {
            const result = await this.authRepository.findUserByEmail(email);
            if (!result || result.length == 0) {
                throw new ErrorResponse(STATUS_CODES.BAD_REQUEST, "가입한 이메일이 아닙니다.");
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

    async encodePassword(password) {
        const key = process.env.ENCRYPTION_KEY;
        const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
        let encryptedPassword = cipher.update(password, 'utf8', 'hex');
        encryptedPassword += cipher.final('hex');
        return encryptedPassword;
    }

    async verifyPassword(password, encryptedPassword) {
        const key = process.env.ENCRYPTION_KEY;
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
        let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
        decryptedPassword += decipher.final('utf8');
        return decryptedPassword === password;
    }
};

module.exports = AuthService;