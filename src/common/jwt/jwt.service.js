const db = require("../../common/database");

exports.checkRefreshToken = (email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM AUTH WHERE email = ? AND user_name = ?', [email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.insertRefreshToken = (refresh_token, email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO AUTH (refresh_token, email, user_name) VALUES (?, ?, ?);', [refresh_token, email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.deleteRefreshToken = (email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM AUTH WHERE email = ? AND user_name = ?', [email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}