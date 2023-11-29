const jwt = require("./dsonwebtoken.js");
const jwtService = require("./jwt.service.js");
const { ACCESS_TOKEN_ERROR, REFRESH_TOKEN_ERROR } = require("./error/jwt.errormessgae.js");
const DuplicatedError = require('./error/jwt.customError.js');

const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_PRIVTATE_KEY;

exports.generateTokens = async (email, user_name) => {
    try {
        const accessToken = await generateAccessToken(email, user_name);
        const refreshToken = await generateRefreshToken(email, user_name);
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

exports.deleteRefreshToken = async (refreshToken) => {
    try {
        const { email, user_name } = jwt.decode(refreshToken);
        await jwtService.deleteRefreshToken(email, user_name);
    } catch (error) {
        throw error;
    }
}

exports.verifyAccessToken = async (accessToken) => {
    try {
        await this.valueValidCheck(accessToken);
        const decodedToken = jwt.verify(accessToken, ACCESS_SECRET_KEY);
        return decodedToken;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error(ACCESS_TOKEN_ERROR.EXPIRED);
            error.message = ACCESS_TOKEN_ERROR.EXPIRED;
            throw error;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            error.message = ACCESS_TOKEN_ERROR.MALFORMED;
            throw error;
        }
        error.message = ACCESS_TOKEN_ERROR.NOT_EXIST;
        throw error;
    }
};

exports.verifyRefreshToken = async (refreshToken) => {
    try {
        await this.valueValidCheck(refreshToken);
        const { email, user_name } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const result = await jwtService.checkRefreshToken(email, user_name);
        if (refreshToken != result[0].refresh_token) {
            throw new DuplicatedError(REFRESH_TOKEN_ERROR.DUPLICATED);
        }
        const newTokens = await this.generateTokens(email, user_name);
        return {
            newAccessToken: newTokens.accessToken, newRefreshToken: newTokens.refreshToken,
            email, user_name
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            error.message = REFRESH_TOKEN_ERROR.EXPIRED;
            throw error;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            error.message = REFRESH_TOKEN_ERROR.MALFORMED;
            throw error;
        }
        if (error instanceof DuplicatedError) {
            throw error;
        }
        error.message = REFRESH_TOKEN_ERROR.NOT_EXIST;
        throw error;
    }
};

const generateAccessToken = async (email, user_name) => {
    return jwt.sign(
        (payload = {
            type: "JWT",
            time: Date.now(),
            email: email,
            user_name: user_name
        }),
        (secret = ACCESS_SECRET_KEY),
        (options = {
            expiresIn: 60 * 60, // 1h
        })
    );
};

const generateRefreshToken = async (email, user_name) => {
    const refreshToken = jwt.sign(
        (payload = {
            type: "JWT",
            time: Date.now(),
            email: email,
            user_name: user_name
        }),
        (secret = REFRESH_SECRET_KEY),
        (options = {
            expiresIn: 60 * 60 * 24, // 1day
        })
    );
    try {
        await jwtService.deleteRefreshToken(email, user_name);
        await jwtService.insertRefreshToken(refreshToken, email, user_name);
        return refreshToken;
    } catch (err) {
        throw err;
    }
};

exports.valueValidCheck = async (value) => {
    if (!value || value == '' || value === undefined || value === 'undefined') {
        throw new Error();
    }
}