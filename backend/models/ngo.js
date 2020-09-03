const mongoose = require('mongoose');
const validator = require('validator');

const ngoSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique: true,
    },
    ngo_name:{
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
    mission:{
        type: String,
        required: true,
        trim: true,
    },
    city:{
        type: String,
        required: true,
        trim: true,
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
    }
});

const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;