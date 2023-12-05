
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
}

module.exports = AuthRepository;