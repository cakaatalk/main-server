const db = require("../../common/database");

exports.findUserByEmailAndPassword = (email, password) => {
    const query =
        `SELECT * FROM USER 
        WHERE email = '${email}' AND password = '${password}';`;

    return new Promise((resolve, reject) => {
        db.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        })
    })
}

exports.addUser = (user) => {
    return new Promise((resolve, reject) => {
        const { user_name, email, password } = user;
        db.query(`INSERT INTO USER (user_name, email, password) VALUES(?, ?, ?)`,
            [user_name, email, password], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
    })
}