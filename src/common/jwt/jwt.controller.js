const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET;

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

exports.generateRefreshToken = (email) => {

}

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