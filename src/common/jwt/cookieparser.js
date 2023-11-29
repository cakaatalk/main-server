function parseCookies(cookieString) {
    const list = {};

    cookieString && cookieString.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}