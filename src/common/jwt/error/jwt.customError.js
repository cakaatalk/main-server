class DuplicatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicatedError';
    }
}
class TokenExpiredError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TokenExpiredError';
    }
}
class JsonWebTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JsonWebTokenError';
    }
}

module.exports =
{
    DuplicatedError,
    TokenExpiredError,
    JsonWebTokenError
};