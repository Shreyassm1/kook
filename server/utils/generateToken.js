const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userName: user.userName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
