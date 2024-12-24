const jwt = require("jsonwebtoken");
require('dotenv').config();

//generate token for user which is unique and set it in a cookie as a response.
const generate = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "5d",
    });
    console.log("token created")
   res.cookie('jwt', token, {
        maxAge: 10*24*60*60*1000,//ms
        httpOnly: true, //xss
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",//for now
    });
    console.log("JWT_SECRET:", process.env.JWT_SECRET);//saved in .env file

};
module.exports = generate;