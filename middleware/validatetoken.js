'use strict'

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

function JsonResponse(res, status, message) {
    res.status(status).json({error: {code: status, message} });
}

function validateToken(req, res, next) {
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    //const authHeader = req.get('Access-Token');
    //const token = authHeader

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