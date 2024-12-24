const express = require("express");
const Menu = require("../models/menu");
const mongoose = require("mongoose");
const router = express.Router();

// Fetch item data from backend and upload it to frontend.
router.get('/getMenu/:canteenId', async (req, res) => {
    const canteenId = req.params.canteenId; // Retrieve canteenId from route parameters
    
    console.log("getMenu route accessed. Canteen ID:", canteenId);
    
    try {
        if (!mongoose.isValidObjectId(canteenId)) {
            console.log("Invalid canteenId provided.");
            return res.status(400).json({ message: "Invalid canteen ID." });
        }

        const menu = await Menu.find({ canteenId });
        if (!menu) {
            console.log("No menu found for canteen ID:", canteenId);
            return res.status(404).json({ message: "No menu found." });
        }
    
        // Send the menu data to the client
        console.log("Menu Data:", menu);
        res.json(menu);

    } catch (error) {
        console.error("Error fetching items:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
