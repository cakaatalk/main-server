require('dotenv').config();
const crypto = require('crypto');
const path = require('path');
const { JsonWebTokenError, TokenExpiredError } = require('./error/jwt.customError.js');
const { TOKEN_ERROR } = require('./error/jwt.errormessgae.js');

const SECRET = "ajou";

function base64(data) {
    return Buffer.from(data)
        .toString('base64')
        .replace('+', '-')
        .replace('/', '_')
        .replace(/=+$/, '');  // Remove padding
}

const dsonwebtoken = {
    sign: (payload, secret, options) => {
        // 헤더
        const header = {
            alg: "HS256",
            typ: "JWT",
        }
        const encodedHeader = base64(JSON.stringify(header));

        // 페이로드
        const finalPayload = {
            ...payload,
            time: payload.time || Date.now(), // 현재 시간을 밀리초로 설정
        }

        if (options.expiresIn) {
            finalPayload.exp = Date.now() + options.expiresIn * 1000; // 만료 시간을 밀리초로 설정
        }

        const encodedPayload = base64(JSON.stringify(finalPayload));

        // 서명
        const signature = crypto
            .createHmac("sha256", secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest("base64")
            .replace('+', '-')
            .replace('/', '_')
            .replace(/=+$/, '');

        return `Bearer ${encodedHeader}.${encodedPayload}.${signature}`;
    },

    verify: (token, secret) => {
        const bearerToken = token.split(' ');
        if (bearerToken.length !== 2) {
            throw new JsonWebTokenError(TOKEN_ERROR.INVALID_FORMAT);
        }

        const parts = bearerToken[1].split('.');
        if (parts.length !== 3) {
            throw new JsonWebTokenError(TOKEN_ERROR.INVALID_FORMAT);
        }

        const [encodedHeader, encodedPayload, signature] = parts;
        const calculatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace('+', '-')
            .replace('/', '_')
            .replace(/=+$/, '');

        if (signature !== calculatedSignature) {
            throw new JsonWebTokenError(TOKEN_ERROR.INVALID_SIGNATURE);
        }

        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf8'));
        if (!payload.exp || payload.exp <= Date.now()) {
            throw new TokenExpiredError(TOKEN_ERROR.EXPIRED);
        }

        return payload;
    },

    decode: (token) => {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new JsonWebTokenError(TOKEN_ERROR.INVALID_FORMAT);
        }

        const encodedPayload = parts[1];
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf8'));
        return payload;
    }
}

// Example usage:
// const token = dsonwebtoken.sign(
//     (payload = {
//         type: "JWT",
//         time: Date.now(),
//         email: "ilovekdh1208@ajou.ac.kr",
//         user_name: "donghyun"
//     }),
//     (secret = SECRET),
//     (options = {
//         expiresIn: -1,
//     })
// );

// try {
//     console.log("토큰 발행: " + token);
//     console.log(dsonwebtoken.verify(token, SECRET));
//     console.log(dsonwebtoken.verify(token, "secret"));
//     console.log(dsonwebtoken.decode(token));
// } catch (e) {
//     console.log(e.name);
//     console.error(e.message);
// }

module.exports = dsonwebtoken;