class DuplicatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicatedError';
    }
}

module.exports = DuplicatedError;