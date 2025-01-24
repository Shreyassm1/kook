const mongoose = require("mongoose");

//cart object --> {array[...],key}
//items array --> [canteenid, itemid, itemdetails...]

const cartSchema = mongoose.Schema({
  items: [
    {
      canteenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menu",
        required: true,
      },
      ItemName: {
        type: String,
        required: true,
      },
      ItemPrice: {
        type: Number,
        required: true,
      },
      ItemImage: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
