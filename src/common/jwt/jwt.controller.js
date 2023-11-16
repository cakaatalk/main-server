const jwt = require('jsonwebtoken')
// const AuthToken = require('../../modules/auth/AuthToekn.js')
const jwtService = require('./jwt.service.js')
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

exports.generateTokens = async (user) => {
    try {
        const accessToken = this.generateAccessToken(user.email);
        const refreshToken = this.generateRefreshToken(user.email);

        // DB에서 Token 있는지 검사
        const existRefreshToken = await jwtService.checkRefreshToken(refreshToken);
        if (existRefreshToken) await jwtService.deleteRefreshToken(existRefreshToken);

        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

exports.validateToken = (accessToken, refreshToken) => {

}

function verifyAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(accessToken, ACCESS_SECRET_KEY));
        }
        catch (error) {
            // AccessToken이 만료되었을 경우, RefreshToken을 DB에서 조회한다.
            if (error.name === 'TokenExpiredError') {
                console.log('Access Token이 만료되었습니다.');
                if (refreshToken) {
                    // RefreshToken이 있을 경우 검증한다
                    jwtService.verifyRefreshToken(refreshToken)
                        // 검증이 유효할 경우 AccessToken을 재발급하고 정상 처리한다
                        .then(() => {
                            const newAccessToken = this.generateAccessToken(jwt.decode(accessToken).email);
                            resolve(newAccessToken);
                        })
                        // 검증이 유효하지 않을 경우 RefreshToken을 삭제하고 사용자가 로그인하도록 유도한다
                        .catch(() => {
                            reject('RefreshToken이 유효하지 않습니다. 다시 로그인해주세요.');
                        });
                }
            }
            if (error.name === 'JsonWebTokenError') {
                reject('유효하지 않은 Access Token입니다.');
            }
        }
    });
}

exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            // DB에 RefreshToken이 있나 체크
            jwtService.checkRefreshToken(refreshToken);
            resolve(jwt.verify(refreshToken, REFRESH_SECRET_KEY));
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                jwtService.deleteRefreshToken(refreshToken);
                reject('Refresh Token이 만료되었습니다.');
            }
            if (error.name === 'JsonWebTokenError') {
                jwtService.deleteRefreshToken(refreshToken);
                reject('유효하지 않은 Refresh Token입니다.');
            }
        }
    });
};