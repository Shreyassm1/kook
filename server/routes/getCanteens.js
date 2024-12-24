const express = require("express");
const Canteen = require("../models/canteens");
const router = express.Router();
//fetch canteen data from backend and upload it to frontend.
router.get("/getCanteens",async (req, res) => {
    console.log("getCanteens route accessed.");
    try {
        const canteens = await Canteen.find();
        if (!canteens || canteens.length === 0) {
            console.log("No canteens found.");
            return res.status(404).json({ message: "No canteens found." });
        }
    
        //map over canteens to include only necessary data in each canteen object
        const canteensData = canteens.map(canteen => {
            return {
                _id: canteen._id,
                canteenName: canteen.canteenName,
                canteenDescription: canteen.canteenDescription,
                canteenLocation: canteen.canteenLocation,
                canteenImage: canteen.canteenImage,
                canteenId: canteen.canteenId
            };
        });

        res.json(canteensData);

    } catch (error) {
        console.error("Error fetching canteens:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;