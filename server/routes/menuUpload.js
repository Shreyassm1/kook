const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const jwt = require("jsonwebtoken");

// const protectRoute = require("../middleware/isAuth");
//route for owner to upload the menu to the db.
router.post("/menuUpload",async (req, res) => {
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
        console.log("Decoded Token Payload:", decodedToken); // Log the decoded token payload

        // Extract the canteenId from the decoded token
        const canteenId = decodedToken.ownerId;
        console.log("Canteen ID:", canteenId);
        console.log("Request Body:", req.body);
        const { ItemName, ItemPrice, ItemDescription, ItemImage } = req.body;
        
        const itemInfo = {
            ItemName,
            ItemPrice,
            ItemDescription,
            ItemImage,
            canteenId: canteenId,
        };
        //create itemInfo object to store in db
        await Menu.create(itemInfo);
        console.log("Item Info:", itemInfo);

        return res.status(201).json({ message: "Menu uploaded successfully." });//201 -> ok + resource created
    } catch (error) {
        console.error("Error in /menuUpload:", error);
        return res.status(500).json({ error: "Internal Server error." });
    }
});

module.exports = router;
