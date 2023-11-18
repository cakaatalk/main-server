const jwt = require("jsonwebtoken");
const jwtService = require("./jwt.service.js");
const { ACCESS_TOKEN_ERROR, REFRESH_TOKEN_ERROR } = require("./jwt.errormessgae.js");

const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_PRIVTATE_KEY;

exports.generateTokens = async (email, user_name) => {
    try {
        const accessToken = generateAccessToken(email, user_name);
        const refreshToken = await generateRefreshToken(email, user_name);
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

exports.validateTokens = async (accessToken, refreshToken) => {
    try {
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

const verifyAccessToken = (accessToken) => {
    console.log('verifyAccessToken');
    if (!accessToken || accessToken == '') {
        throw new Error(ACCESS_TOKEN_ERROR.NOT_EXIST);
    }
    return new Promise((resolve, reject) => {
        try {
            const decodedToken = jwt.verify(accessToken, ACCESS_SECRET_KEY);
            return resolve(decodedToken);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error(ACCESS_TOKEN_ERROR.EXPIRED);
                return reject(error);
            }
            console.error(ACCESS_TOKEN_ERROR.MALFORMED);
            error.message = ACCESS_TOKEN_ERROR.MALFORMED;
            return reject(error);
        }
    });
}

const verifyRefreshToken = async (refreshToken) => {
    console.log('verifyRefreshToken');
    if (!refreshToken || refreshToken == '') {
        throw new Error(REFRESH_TOKEN_ERROR.NOT_EXIST);
    }
    try {
        const { email, user_name } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newTokens = await this.generateTokens(email, user_name);
        return {
            newAccessToken: newTokens.accessToken, newRefreshToken: newTokens.refreshToken,
            email, user_name
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error(REFRESH_TOKEN_ERROR.EXPIRED);
            error.message = REFRESH_TOKEN_ERROR.EXPIRED;
            const { email, user_name } = jwt.decode(refreshToken);
            jwtService.deleteRefreshToken(email, user_name);
            throw error;
        }
        console.error(REFRESH_TOKEN_ERROR.MALFORMED);
        error.message = REFRESH_TOKEN_ERROR.MALFORMED;
        throw error;
    }
};

const generateAccessToken = (email, user_name) => {
    console.log('AccessToken 발급');
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
    console.log('RefreshToken 발급');
    const refreshToken = jwt.sign(
        (payload = {
            type: "JWT",
            time: Date(),
            email: email,
            user_name: user_name
        }),
        (secret = REFRESH_SECRET_KEY),
        (options = {
            expiresIn: "2m",
        })
    );
    try {
        const results = await jwtService.checkRefreshToken(email, user_name);
        if (results.length > 0) {
            jwtService.deleteRefreshToken(email, user_name);
        }
        await jwtService.insertRefreshToken(refreshToken, email, user_name);
        return refreshToken;
    } catch (err) {
        throw err;
    }
};

const isObjectEmpty = async (obj) => {
    if (obj instanceof Object) {
        if (Object.keys(obj).length === 0) {
            return true;
        }
        return false;
    }
    return false;
}