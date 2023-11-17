const jwt = require("jsonwebtoken");
const jwtService = require("./jwt.service.js");
const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_PRIVTATE_KEY;

exports.generateTokens = async (email, user_name) => {
    try {
        const accessToken = generateAccessToken(email, user_name);
        const refreshToken = generateRefreshToken(email, user_name);
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

const generateAccessToken = (email, user_name) => {
    return jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            email: email,
            user_name: user_name
        }),
        (secret = ACCESS_SECRET_KEY),
        (options = {
            expiresIn: "15m",
        })
    );
};

const generateRefreshToken = async (email, user_name) => {
    const refresh_token = jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            email: email,
            user_name: user_name
        }),
        (secret = REFRESH_SECRET_KEY),
        (options = {
            expiresIn: "30d",
        })
    );

    try {
        await jwtService.checkRefreshToken(email, user_name);
        await jwtService.insertRefreshToken(refresh_token, email, user_name);
    } catch (err) {
        throw err;
    }
};
