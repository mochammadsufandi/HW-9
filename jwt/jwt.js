const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret';


const generateToken = (payload) => {
    return jwt.sign(payload,SECRET_KEY,)
};

const verifyToken = (token) => {
    return jwt.verify(token,SECRET_KEY)
}

module.exports = {generateToken,verifyToken};