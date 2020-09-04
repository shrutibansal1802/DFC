const jwt = require('jsonwebtoken');
const Donor = require('../models/donor');

const auth = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'donorforlocal');
        const donor = await Donor.findOne({ _id:decoded._id, 'tokens.token':token });
        if(!donor){
            throw new Error('Please Authenticate')
        }
        req.token = token;
        req.donor = donor;
        next();
    } catch (e) {
        res.status(401).send({ error:'Please authenticate.' });
    }
}

module.exports = auth;