const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const jwt = require("jsonwebtoken");
const verifyOwner = require("../middleware/isOwner");

router.post("/menuUpload/:canteenId", verifyOwner, async (req, res) => {
  console.log("Menu Upload Route accessed.");
  const canteenId = req.params.canteenId;
  try {
    if (!req.owner) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Request Body:", req.body);
    const { ItemName, ItemPrice, ItemDescription, ItemImage } = req.body;

    const itemInfo = {
      ItemName,
      ItemPrice,
      ItemDescription,
      ItemImage,
      canteenId: canteenId,
    };

    await Menu.create(itemInfo);
    console.log("Item Info:", itemInfo);

    return res.status(201).json({ message: "Menu uploaded successfully." });
  } catch (error) {
    console.error("Error in /menuUpload:", error);
    return res.status(500).json({ error: "Internal Server error." });
  }
});

module.exports = router;
