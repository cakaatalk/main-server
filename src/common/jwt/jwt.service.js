const mysql = require("../../common/database");

exports.checkRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        mysql.query('SELECT * FROM AUTH WHERE refresh_token = ?', [refreshToken], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve(refreshToken);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

exports.insertRefreshToken = (email, refreshToken) => {
    return new Promise((resolve, reject) => {
        mysql.query('INSERT INTO AUTH (refresh_token, email) VALUES (?, ?);', [refreshToken, email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

exports.deleteRefreshToken = (email, id) => {
    return new Promise((resolve, reject) => {
        mysql.query('DELETE FROM AUTH WHERE email = ? AND user_id = ?', [email, id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}