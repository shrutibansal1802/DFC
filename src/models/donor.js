const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const donorSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please enter an email'],
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
    city:{
        type:String,
        lowercase: true,
        trim:true
    },
    password:{
        type:String,
        required:[true, 'Please enter a password'],
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
});

donorSchema.methods.toJSON= function(){
    const donor = this;
    const donorObject = donor.toObject();

    delete donorObject.password;
    delete donorObject.tokens;

    return donorObject;
}

donorSchema.methods.generateAuthToken= async function () {
    const donor = this;

    const token = jwt.sign({ _id: donor._id.toString() }, 'donorforlocal')
    donor.tokens = donor.tokens.concat({ token })
    await donor.save()
    return token
}

donorSchema.statics.findByCredentials = async (email, password)=>{
    const donor = await Donor.findOne({ email });

    if(!donor){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, donor.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }
    return donor;
}

//While adding a donor
donorSchema.pre("save", async function(next){
    const donor = this;

    if(donor.isModified('password')){
        donor.password = await bcrypt.hash(donor.password, 8);
    }
    next();
})

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;