const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not Authenticated!');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'secretfortoken')
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated!');
        error.statusCode = 401;
        throw error;
    }

    req.isUserLoggedIn = true;
    req.member_id = decodedToken.member_id;
    req.mem_username = decodedToken.mem_username;
    next();
}