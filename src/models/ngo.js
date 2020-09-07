const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Event = require('./event');

const ngoSchema = new mongoose.Schema({
    ngoname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    contact:{
        type:Number,
        required: true,
        trim: true,
        minlength:10,
    },
    category:{
        type: String,
        required: true,
        trim: true,
    },
    city:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password contains password string in it.')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
}, {
    timestamps: true
});

ngoSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'owner'
})

ngoSchema.methods.toJSON = function(){
    const ngo = this;
    const ngoObject = ngo.toObject();
    
    delete ngoObject.password;
    delete ngoObject.tokens;

    return ngoObject;
}

ngoSchema.methods.generateAuthToken = async function(){
    const ngo = this;

    const token = jwt.sign({ _id: ngo._id.toString() }, 'donorforlocal');
    ngo.tokens = ngo.tokens.concat({ token });
    await ngo.save();
    return token;
}

ngoSchema.statics.findByCredential = async (email, password)=>{
    const ngo = await Ngo.findOne({ email });

    if(!ngo){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, ngo.password);
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return ngo;
}

ngoSchema.pre("save", async function(next){
    const ngo = this;

    if(ngo.isModified('password')){
        ngo.password = await bcrypt.hash(ngo.password, 8)
    }
    next();
})

const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;