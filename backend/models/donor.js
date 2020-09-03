const mongoose = require('mongoose');
const validator = require('validator');

const donorSchema = new mongoose.Schema({
    name:{
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
    hobbies:[{
        type:String,
    }],
    profession:{
        type: String,
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

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;