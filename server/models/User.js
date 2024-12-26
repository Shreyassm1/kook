const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    userName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        required: false,
    },
    refreshToken: {
        type: String
    }
    
});

const User = mongoose.model("User", userSchema);
module.exports = User;