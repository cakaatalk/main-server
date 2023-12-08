
class AuthRepository {
    constructor(db) {
        this.db = db;
    }
    findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM USER WHERE email = ?`;
            this.db.query(query, [email], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            });
        });
    };

    findUserByEmailAndPassword(email, password) {
        const query =
            `SELECT * FROM USER 
            WHERE email = '${email}' AND password = '${password}';`;

        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            })
        })
    }

    addUser(user_name, email, password) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO USER (user_name, email, password) VALUES(?, ?, ?)`,
                [user_name, email, password], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    updateUserPassword(email, password) {
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE USER SET password = ? WHERE email = ?`,
                [password, email], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    addAuthCode(email, authCode) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO AUTHEMAIL (email, auth_code) VALUES(?, ?)`,
                [email, authCode], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    getAuthCode(email) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT auth_code FROM AUTHEMAIL WHERE email = ?`,
                [email], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    getVerity(email) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT verified FROM AUTHEMAIL WHERE email = ?`,
                [email], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    setVerity(email) {
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE AUTHEMAIL SET verified = true WHERE email = ?`,
                [email], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }

    deleteAuthCode(email) {
        return new Promise((resolve, reject) => {
            this.db.query(`DELETE FROM AUTHEMAIL WHERE email = ?`,
                [email], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
        })
    }
}

module.exports = AuthRepository;