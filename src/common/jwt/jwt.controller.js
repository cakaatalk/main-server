const jwt = require('jsonwebtoken')
// TODO: env로 빼기
const SECRET_KEY = 'CAKAATALK';

exports.generateAccessToken = (email) => {
    return jwt.sign(
        payload = {
            type: 'JWT',
            time: Date(),
            email: email
        },
        secret = SECRET_KEY,
        options = {
            expiresIn: '15m'
        }
    );
}

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