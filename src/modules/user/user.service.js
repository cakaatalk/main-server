const db = require("../../common/database");

exports.findUser = (req, res) => {
    const userId = req.headers.userId;
    const query = `SELECT id, user_name FROM USER WHERE id = ?`;
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        console.log(results);
    })
}