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
        const header = {
            alg: "HS256",
            typ: "JWT",
        }
        const encodedHeader = base64(JSON.stringify(header));

        const finalPayload = {
            ...payload,
            time: payload.time || Date.now(),
        }

        if (options.expiresIn) {
            finalPayload.exp = Date.now() + options.expiresIn * 1000;
        }

        const encodedPayload = base64(JSON.stringify(finalPayload));

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

module.exports = dsonwebtoken;