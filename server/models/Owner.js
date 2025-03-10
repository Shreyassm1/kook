const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  hasCanteen: {
    type: Boolean,
    default: false, // Default to false, meaning no canteen.
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;
