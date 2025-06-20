const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({

    name: {
    type: String,
    required: true,
    trim: true,
    },
    
    email: {
        type:String, 
        required:true, 
        unique:true, 
        lowercase:true,
    },

    password: {
        type: String,
        required:true, 
    },

    role: {
        type:String, 
        enum:['client', 'admin', 'Directeur Technique', 'Chef de projet', 'Techniciens'],
    },

    isApproved: {
        type:Boolean, 
        default:false,
    },
}, {timestamps:true});

const User = mongoose.model('User' , userSchema);
module.exports = User; 