const db = require("../../common/database");

exports.checkRefreshToken = (id, email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM AUTH WHERE user_id = ? AND email = ? AND user_name = ?', [id, email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.insertRefreshToken = (refresh_token, id, email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO AUTH (refresh_token, user_id, email, user_name) VALUES (?, ?, ?, ?);', [refresh_token, id, email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.deleteRefreshToken = (id, email, user_name) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM AUTH WHERE user_id = ? AND email = ? AND user_name = ?', [id, email, user_name], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}