const express = require("express");
const Canteen = require("../models/canteens");
const router = express.Router();
const mongoose = require("mongoose");
const verifyJWT = require("../middleware/isAuth");

//-----------------------------------------------------RETRIEVE CANTEENS---------------------------------------------------------------
//1.Check if user is logged in, only then access canteens else throw 401.
//2.Retrieve all data from canteens db.
//3.If specific data needs to be retrieved(User is inside the canteen page and backend has access to the ID of that specific canteen)
//(a)Get canteenID from url --> req.params.CanteenID
//(b)Use canteenID to map over the db --> .map((items) => {return items.canteenName})
//-------------------------------------------------------------------------------------------------------------------------------------

router.get("/getCanteens", verifyJWT, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  try {
    const canteens = await Canteen.find();
    if (!canteens || canteens.length === 0) {
      return res
        .status(404) //Not Found
        .json({ message: "No canteens found." });
    }
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
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal server error." });
  }
});

//remove getCanteenName, reuse getMenu

router.get("/getCanteenName/:canteenId", async (req, res) => {
  const canteenId = req.params.canteenId;
  try {
    if (!mongoose.isValidObjectId(canteenId)) {
      console.log("Invalid canteenId provided.");
      return res.status(400).json({ message: "Invalid canteen ID." });
    }

    const canteen = await Canteen.find({ canteenId });
    if (!canteen) {
      console.log("No menu found for canteen ID:", canteenId);
      return res
        .status(404) //Not Found
        .json({ message: "No menu found." });
    }

    const canteenName = canteen.map((canteen) => canteen.canteenName);
    res.json(canteenName);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal server error." });
  }
});

module.exports = router;
