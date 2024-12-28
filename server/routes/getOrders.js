const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/isAuth");
const Order = require("../models/Orders");

router.get("/getOrders", verifyJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const orders = await Order.find({ userId: req.user._id });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
