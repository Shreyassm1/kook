const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJWT = async (req, res, next) => {
  
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ error: "Invalid Access token." });
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token." });
  }
};

module.exports = verifyJWT; 
