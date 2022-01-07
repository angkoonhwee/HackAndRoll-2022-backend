require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header("x-auth-token");

    // deny access if no token
    if (!token) {
        return res.status(401).json({ msg: "No token, authorisation denied" });
    }

    // verify token
    try {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Token is not valid" });
            } else {
                req.user = decoded.user;
                next();
            }
        })
    } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}
