const db = require("../../common/database");

exports.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM USER WHERE email = ?`;
        db.query(query, [email], (error, rows) => {
            if (error) {
                return reject(error);
            }
            if (rows.length > 0) {
                return resolve(rows);
            } else {
                return reject('User not found');
            }
        });
    })
}