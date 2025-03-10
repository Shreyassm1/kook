const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/isAuth");
const Order = require("../models/Orders");
const verifyOwner = require("../middleware/isOwner");

router.get("/getOrders", verifyJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
router.get("/getOrdersOwners", verifyOwner, async (req, res) => {
  try {
    if (!req.owner) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const orders = await Order.find({ canteenId: req.owner._id });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
