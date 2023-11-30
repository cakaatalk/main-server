exports.parseCookies = (cookieString) => {

    console.log(cookieString);
    const list = {};

    cookieString && cookieString.split(';').forEach(function (cookie) {
        console.log(cookie);
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}