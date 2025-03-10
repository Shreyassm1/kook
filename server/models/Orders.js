const mongoose = require("mongoose");
//order object --> {...orderDetails, itemDetails array [name,quantity]}

const orderSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  canteenId: {
    type: String,
  },
  items: [
    {
      itemName: String,
      quantity: String,
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
