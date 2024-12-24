const jwt = require("jsonwebtoken");
const User = require("../models/User");
//this middleware is triggered whenever the router -- endpoint with this as argument is reached.
//checks if the user data --> cookie has tooken --> if yes --> check if valid --> if yes -->check if user exists. 
const protectRoute = async (req, res) => {
    console.log("protectRoute accessed");
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" }); // Send 401 status if no token provided
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" }); // Send 401 status if token is invalid
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        // Send status 200 with user data
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" }); // Send 500 status in case of any error
    }
};

module.exports = protectRoute;
