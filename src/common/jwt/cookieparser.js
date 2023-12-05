exports.parseCookies = (cookieHeader) => {

    const cookies = {};

    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            const name = parts[0].trim();
            const value = parts[1];
            cookies[name] = value;
        });
    }

    return cookies;
}