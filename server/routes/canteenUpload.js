const express = require("express");
const router = express.Router();
const canteen = require("../models/canteens");
const Owner = require("../models/Owner");  // Add the Owner model import
const jwt = require("jsonwebtoken");

// Route for owner to post canteen info to the db and register his canteen
router.post("/ownerPost", async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
        console.log("JWT Token from Request Cookies:", token); 
        
        if (!token) {
            throw new Error("JWT token not provided in request cookies");
        }
        
        // Verify the token and decode the payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const ownerId = decodedToken.ownerId; // Use ownerId from the decoded token

        // Extract canteen details from the request body
        const { canteenName, canteenDescription, canteenLocation, canteenImage } = req.body;

        if (!canteenName || !canteenDescription || !canteenLocation || !canteenImage) {
            return res.status(400).json({ message: "Invalid request body." });
        }

        // Create the canteen info object
        const canteenInfo = {
            canteenName,
            canteenDescription,
            canteenLocation,
            canteenImage,
            canteenId: ownerId // Link the canteen to the owner
        };

        // Save the canteen info to the database
        await canteen.create(canteenInfo);

        // Update the 'hasCanteen' field in the Owner model
        await Owner.findByIdAndUpdate(ownerId, { hasCanteen: true });

        return res.status(201).json({ message: "Canteen registered successfully and owner hasCanteen updated." });
    } catch (error) {
        console.error("Error in /ownerPost:", error);
        return res.status(500).json({ error: "Internal Server error." });
    }
});

module.exports = router;
