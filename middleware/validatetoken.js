'use strict'

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

function JsonResponse(res, status, message) {
    res.status(statuscode).json({error: {code: statusCode, message} });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return JsonResponse(res, 401, 'Unauthorized - Token not provided');
    }

    jwt.verify(token, JWT_SECRET, (err, id) => {
        if(err) {
            return JsonResponse(res, 403, 'Forbidden - Invalid token');
        }

        req.id = id;
        next();
    });
};

module.exports = validateToken;