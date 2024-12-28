const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

const verifyOwner = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const owner = await Owner.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!owner) {
      return res.status(401).json({ error: "Invalid Access token." });
    }

    req.owner = owner;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token." });
  }
};

module.exports = verifyOwner;
