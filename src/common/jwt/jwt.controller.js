const jwt = require("jsonwebtoken");
const jwtService = require("./jwt.service.js");
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
        return (await verifyAccessToken(accessToken));
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            try {
                return (await verifyRefreshToken(refreshToken));
            } catch (error) {
                throw error;
            }
        }
        throw error;
    }
};

const verifyAccessToken = (accessToken) => {
    if (!accessToken || accessToken == '') {
        throw new Error('AccessToken이 없습니다');
    }
    return new Promise((resolve, reject) => {
        try {
            return resolve(jwt.verify(accessToken, ACCESS_SECRET_KEY));
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return reject(error);
            }
            return reject(error);
        }
    });
}

const verifyRefreshToken = (refreshToken) => {
    if (!refreshToken || refreshToken == '' || !isObjectEmpty(refreshToken)) {
        throw new Error('RefreshToken이 없습니다');
    }
    return new Promise((resolve, reject) => {
        try {
            return resolve(jwt.verify(refreshToken, REFRESH_SECRET_KEY));
        } catch (error) {
            return reject(error);
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
    return jwt.sign(
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
    // try {
    //     await jwtService.checkRefreshToken(email, user_name);
    //     await jwtService.insertRefreshToken(refresh_token, email, user_name);
    // } catch (err) {
    //     throw err;
    // }
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