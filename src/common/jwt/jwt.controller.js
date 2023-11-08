const jwt = require('jsonwebtoken')
const AuthToken = require('../../modules/auth/AuthToekn.js')
const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_PRIVTATE_KEY;

exports.generateAccessToken = (email) => {
    return jwt.sign(
        payload = {
            type: 'JWT',
            time: Date(),
            email: email
        },
        secret = ACCESS_SECRET_KEY,
        options = {
            expiresIn: '15m'
        }
    );
}

exports.generateRefreshToken = (email) => {
    return jwt.sign(
        payload = {
            type: 'JWT',
            time: Date(),
            email: email
        },
        secret = REFRESH_SECRET_KEY,
        options = {
            expiresIn: '30d'
        }
    )
}

exports.generateTokens = async (email) => {
    try {


        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

// TODO: DB에 AccessToken을 저장해 관리
exports.destroyAccessToken = (req, res, next) => {
    req.headers.authorization = "";
    next();
}


exports.validateToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(accessToken, SECRET_KEY));
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                reject('토큰이 만료되었습니다.');
            }
            if (error.name === 'JsonWebTokenError') {
                reject('유효하지 않은 토큰입니다.');
            }
        }
    });
}