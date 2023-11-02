const jwtController = require('../../common/jwt/jwt.controller');
const userService = require('../user/user.service');

exports.login = async (req, res) => {
    const email = req.query.email;
    const result = await userService.findUserByEmail(email);
    console.log(result);
    const accessToken = jwtController.generateAccessToken(result[0].email);

}
