const mongoose = require("mongoose");

const canteenSchema = mongoose.Schema({
    canteenName: {
        type: String,
        required: false,
    },
    canteenImage: {
        type: String,
        requried: false,
    },
    canteenDescription: {
        type: String,
        required: false,
    },
    canteenLocation: {
        type: String,
        requried: false,
    },
    canteenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
    }
});

const canteen = mongoose.model("canteen", canteenSchema);
module.exports = canteen;
