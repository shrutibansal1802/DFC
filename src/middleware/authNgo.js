const jwt = require('jsonwebtoken');
const Ngo = require('../models/ngo');

const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt1;
        const decoded = jwt.verify(token, 'donorforlocal');
        const ngo = await Ngo.findOne({ _id: decoded._id, 'tokens.token':token });
        if(!ngo){
            throw new Error('Please Authenticate!');
        }
        req.token = token;
        req.ngo = ngo;
        next();
    } catch (e) {
        res.status(401).send({ error:'Please authenticate.' });
    }
}

module.exports = auth;