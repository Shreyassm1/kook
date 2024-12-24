const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
    ItemName: {
        type: String,
        required: true,
    },
    ItemPrice: {
        type: Number,
        required: true,
    },
    ItemDescription: {
        type: String,
        required: true,
    },
    ItemImage: {
        type: String,
        required: true,
    },
    canteenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner'
    }
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
