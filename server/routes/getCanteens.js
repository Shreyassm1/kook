const express = require("express");
const Canteen = require("../models/canteens");
const router = express.Router();
const mongoose = require("mongoose");
//fetch canteen data from backend and upload it to frontend.
router.get("/getCanteens", async (req, res) => {
  try {
    const canteens = await Canteen.find();
    if (!canteens || canteens.length === 0) {
      console.log("No canteens found.");
      return res.status(404).json({ message: "No canteens found." });
    }

    //map over canteens to include only necessary data in each canteen object
    const canteensData = canteens.map((canteen) => {
      return {
        _id: canteen._id,
        canteenName: canteen.canteenName,
        canteenDescription: canteen.canteenDescription,
        canteenLocation: canteen.canteenLocation,
        canteenImage: canteen.canteenImage,
        canteenId: canteen.canteenId,
      };
    });

    res.json(canteensData);
  } catch (error) {
    console.error("Error fetching canteens:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/getCanteenName/:canteenId", async (req, res) => {
  const canteenId = req.params.canteenId; // Retrieve canteenId from route parameters
  try {
    if (!mongoose.isValidObjectId(canteenId)) {
      console.log("Invalid canteenId provided.");
      return res.status(400).json({ message: "Invalid canteen ID." });
    }

    const canteen = await Canteen.find({ canteenId });
    if (!canteen) {
      console.log("No menu found for canteen ID:", canteenId);
      return res.status(404).json({ message: "No menu found." });
    }

    const canteenName = canteen.map((canteen) => canteen.canteenName);
    // console.log(canteenName);
    res.json(canteenName);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
