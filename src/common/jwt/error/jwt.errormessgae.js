const ACCESS_TOKEN_ERROR = {
    NOT_EXIST: "AccessToken 없습니다.",
    EXPIRED: "AccessToken이 만료됐습니다.",
    MALFORMED: "AccessToken 형식이 올바르지 않습니다."
};

const REFRESH_TOKEN_ERROR = {
    NOT_EXIST: "RefreshToken이 없습니다.",
    EXPIRED: "RefreshToken이 만료됐습니다.",
    MALFORMED: "RefreshToken의 형식이 올바르지 않습니다.",
    DUPLICATED: "이전에 발급한 RefreshToken입니다."
};

const TOKEN_ERROR = {
    EXPIRED: "Token has expired",
    INVALID_SIGNATURE: "Invalid token signature",
    INVALID_FORMAT: "Invalid token format"
}

module.exports = {
    ACCESS_TOKEN_ERROR,
    REFRESH_TOKEN_ERROR,
    TOKEN_ERROR
};
