const express = require("express");
const router = express.Router();
const canteen = require("../models/canteens");
const jwt = require("jsonwebtoken");
// const protectRoute = require("../middleware/isAuth");
//route for owner to post canteen info to the db and register his canteen.
router.post("/ownerPost",async (req, res) => {
    try {

        // Extract token from authorization header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
        console.log("JWT Token from Request Cookies:", token); 
        
        if (!token) {
            throw new Error("JWT token not provided in request cookies");
        }
        
        // verify the token
        //decode the payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const canteenId = decodedToken.ownerId;
        const { canteenName, canteenDescription, canteenLocation, canteenImage } = req.body;

        if (!canteenName || !canteenDescription || !canteenLocation || !canteenImage) {
            return res.status(400).json({ message: "Invalid request body." });
        }

        const canteenInfo = {
            canteenName,
            canteenDescription,
            canteenLocation,
            canteenImage,
            canteenId : canteenId
        };

        await canteen.create(canteenInfo);

        return res.status(201).json({ message: "Canteen registered successfully." });
    } catch (error) {
        console.error("Error in /ownerPost:", error);
        return res.status(500).json({ error: "Internal Server error." });
    }
});

module.exports = router;
