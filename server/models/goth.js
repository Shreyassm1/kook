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
        required : false,
    },
    profilePicture : {
        type : mongoose.Schema.Types.ObjectId,
    }
    
});

const goth = mongoose.model("goth", userSchema);
module.exports = goth;