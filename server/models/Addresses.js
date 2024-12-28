const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hostel: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
