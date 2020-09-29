const mongoose = require('mongoose');
const validator = require('validator');

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    volunteersRequired:{
        type: String,
        trim: true
    },
    category:{
        type: String,
    },
    otherRequirements:{
        type: String,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    address:{
        type: String,
        trim: true,
        lowercase:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ngo'
    }
}, {
    timestamps:true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;