const jwt = require("jsonwebtoken");
const jwtService = require("./jwt.service.js");
const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_PRIVTATE_KEY;

exports.generateTokens = async (user) => {
    try {
        const { email, user_name } = user;
        const accessToken = this.generateAccessToken({ email, user_name });
        const refreshToken = this.generateRefreshToken({ email, user_name });
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

exports.validateTokens = async (accessToken, refreshToken) => {
    try {
        return (await verifyAccessToken(accessToken));
    } catch (error) {
        return (await verifyRefreshToken(refreshToken));
    }
};

const verifyAccessToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(accessToken, ACCESS_SECRET_KEY));
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                console.error("Access Token이 만료되었습니다.");
                reject(error);
            }
            console.error("유효하지 않은 Access Token입니다.");
            throw error;
        }
    });
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            jwtService.checkRefreshToken(refreshToken);
            resolve(jwt.verify(refreshToken, REFRESH_SECRET_KEY));
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                jwtService.deleteRefreshToken(refreshToken);
                reject("Refresh Token이 만료되었습니다.");
            }
            if (error instanceof JsonWebTokenError) {
                jwtService.deleteRefreshToken(refreshToken);
                reject("유효하지 않은 Refresh Token입니다.");
            }
        }
    });
};

const generateAccessToken = (info) => {
    return jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            info: info
        }),
        (secret = ACCESS_SECRET_KEY),
        (options = {
            expiresIn: "15m",
        })
    );
};

const generateRefreshToken = (info) => {
    return jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            info: info
        }),
        (secret = REFRESH_SECRET_KEY),
        (options = {
            expiresIn: "30d",
        })
    );
};
