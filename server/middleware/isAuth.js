const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); //.select() is used to include or exclude specified field in query result. '-' represents exclusion.

    if (!user) {
      return res.status(401).json({ error: "Invalid Access token." });
    }

    req.user = user;
    next(); //gives control to the route handler or next middleware.
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token." });
  }
};

module.exports = verifyJWT;
