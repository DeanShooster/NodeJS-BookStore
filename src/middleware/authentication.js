const jwt = require('jsonwebtoken');
const Admin = require('../db/models/admin');
const User = require('../db/models/user');

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        const decoded = await Admin.verifyToken(token);
        req.admin = decoded;
        next();
    }
    catch (e) {
        res.send({ status: 401, Message: 'No Authentication.' })
    }
};


const userAuth = async (req,res,next) => {
    try{
        const { token } = req.headers;
        const decoded = await User.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(e){
        res.send({ status: 401, Message: 'No Authentication.' })
    }
};


module.exports = { adminAuth,userAuth };