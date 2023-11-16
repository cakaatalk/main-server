const mysql = require("../../common/database");

// RefreshToken 검사 함수
exports.checkRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        mysql.query('SELECT * FROM AUTH WHERE refresh_token = ?', [refreshToken], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve(refreshToken); // Token이 존재함
                } else {
                    resolve(false); // Token이 존재하지 않음
                }
            }
        });
    });
}

exports.insertRefreshToken = (email, refreshToken) => {
    return new Promise((resolve, reject) => {
        mysql.query('INSERT INTO AUTH (email, refresh_token) VALUES (?, ?);', [email, refreshToken], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// RefreshToken 삭제 함수
exports.deleteRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        mysql.query('DELETE FROM AUTH WHERE refresh_token = ?', [refreshToken], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}