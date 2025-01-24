const express = require("express");
const Canteen = require("../models/canteens");
const Menu = require("../models/menu");
const mongoose = require("mongoose");
const router = express.Router();

//Same logic as getCanteen
//mongoose.isValidObjectId returns true if the argument passed can be cast as an object ID by mongoose.

router.get("/getMenu/:canteenId", async (req, res) => {
  const canteenId = req.params.canteenId;

  try {
    if (!mongoose.isValidObjectId(canteenId)) {
      console.log("Invalid canteenId provided.");
      return res.status(400).json({ message: "Invalid canteen ID." });
    }

    // const canteen = Canteen.findById(canteenId);
    // const canteenName = canteen.canteenName;
    //can return from here directly making getCanteenName redundant.

    const menu = await Menu.find({ canteenId });
    if (!menu) {
      console.log("No menu found for canteen ID:", canteenId);
      return res.status(404).json({ message: "No menu found." });
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
