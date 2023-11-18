const jwt = require("jsonwebtoken");
const jwtService = require("./jwt.service.js");
const { ACCESS_TOKEN_ERROR, REFRESH_TOKEN_ERROR } = require("./jwt.errormessgae.js");

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

exports.validateTokens = async (accessToken, refreshToken) => {
    try {
        await valueValidCheck(accessToken, refreshToken);
        return await verifyAccessToken(accessToken);
    } catch (accessTokenError) {
        if (accessTokenError instanceof jwt.TokenExpiredError) {
            try {
                return await verifyRefreshToken(refreshToken);
            } catch (refreshTokenError) {
                throw refreshTokenError;
            }
        }
        throw accessTokenError;
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

const verifyAccessToken = async (accessToken) => {
    try {
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
        throw error;
    }
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const { email, user_name } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newTokens = await this.generateTokens(email, user_name);
        return {
            newAccessToken: newTokens.accessToken, newRefreshToken: newTokens.refreshToken,
            email, user_name
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            error.message = REFRESH_TOKEN_ERROR.EXPIRED;
            await this.deleteRefreshToken(refreshToken);
            throw error;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            error.message = REFRESH_TOKEN_ERROR.MALFORMED;
            throw error;
        }
        throw error;
    }
};

const generateAccessToken = async (email, user_name) => {
    return jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            email: email,
            user_name: user_name
        }),
        (secret = ACCESS_SECRET_KEY),
        (options = {
            expiresIn: "1m",
        })
    );
};

const generateRefreshToken = async (email, user_name) => {
    const refreshToken = jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            email: email,
            user_name: user_name
        }),
        (secret = REFRESH_SECRET_KEY),
        (options = {
            expiresIn: "1m",
        })
    );
    try {
        const results = await jwtService.checkRefreshToken(email, user_name)
        if (results.length > 0) {
            await jwtService.deleteRefreshToken(email, user_name);
        }
        await jwtService.insertRefreshToken(refreshToken, email, user_name);
        return refreshToken;
    } catch (err) {
        throw err;
    }
};

exports.valueValidCheck = async (accessToken, refreshToken) => {
    if (!accessToken || accessToken == '' || accessToken === undefined || accessToken === 'undefined') {
        throw new Error('Access 토큰 값이 없습니다');
    }
    if (!refreshToken || refreshToken == '' || refreshToken === undefined || refreshToken === 'undefined') {
        throw new Error('Refresh 토큰 값이 없습니다');
    }
}