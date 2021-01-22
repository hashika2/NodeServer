const jwt = require('jsonwebtoken');

/***   check autherization   ***/
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return  res.status(403).json({error:'Forbidden'});
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({error:'Unauthorized'});
    }
};

module.exports = authenticateJWT;