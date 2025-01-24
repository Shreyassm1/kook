const express = require("express");
const router = express.Router();
const canteen = require("../models/canteens");
const Owner = require("../models/Owner");
const verifyOwner = require("../middleware/isOwner");

router.post("/ownerPost", verifyOwner, async (req, res) => {
  if (!req.owner) {
    return res
      .status(401) //Unauthorized owner
      .json({ error: "Unauthorized access" });
  }

  try {
    const { canteenName, canteenDescription, canteenLocation, canteenImage } =
      req.body;
    const ownerId = req.owner._id;
    if (
      !canteenName ||
      !canteenDescription ||
      !canteenLocation ||
      !canteenImage
    ) {
      return res
        .status(400) //Bad Request
        .json({ message: "Invalid request body." });
    }

    const canteenInfo = {
      canteenName,
      canteenDescription,
      canteenLocation,
      canteenImage,
      canteenId: ownerId,
    };

    await canteen.create(canteenInfo);
    await Owner.findByIdAndUpdate(ownerId, { hasCanteen: true });

    return res
      .status(201) //Created
      .json({
        message:
          "Canteen registered successfully and owner hasCanteen updated.",
      });
  } catch (error) {
    console.error("Error in /ownerPost:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal Server error." });
  }
});

module.exports = router;
