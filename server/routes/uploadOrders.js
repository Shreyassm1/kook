const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/isAuth");
const Order = require("../models/Orders");
const Address = require("../models/Addresses");

router.post("/uploadOrder", verifyJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const userId = req.user._id;
    const { cartItems, amount } = req.body;
    const items = [];

    for (const itemId in cartItems) {
      const { ItemName, itemCount } = cartItems[itemId];
      items.push({ itemName: ItemName, quantity: itemCount });
    }

    const userAddress = await Address.findOne({ userId });
    const hostelName = userAddress ? userAddress.hostel : null;

    const orderInfo = {
      userId: userId,
      items: items,
      amount,
      address: hostelName,
      delivery: "test",
    };

    await Order.create(orderInfo);
    res.status(200).json({ message: "Order Uploaded" });
  } catch (error) {
    console.error("Error uploading order:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
