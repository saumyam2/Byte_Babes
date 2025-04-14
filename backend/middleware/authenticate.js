const jwt = require('jsonwebtoken');

const authenticatetoken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decodedToken; // attach user data
        } catch (error) {
            console.log("Invalid token. Proceeding as anonymous.");
        }
    } else {
        console.log("No token provided. Proceeding as anonymous.");
    }

    next(); // proceed in all cases
};

module.exports = authenticatetoken;
