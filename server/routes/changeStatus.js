const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const verifyOwner = require("../middleware/isOwner");

router.post("/updateStatus", verifyOwner, async (req, res) => {
  try {
    if (!req.owner) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { orderId, check } = req.body;
    let status =
      check === 1 ? "Accepted" : check === 2 ? "Delivered" : "Rejected";

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true } // Returns the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Status updated", updatedOrder });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
