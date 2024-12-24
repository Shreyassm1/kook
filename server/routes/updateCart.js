const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Cart = require("../models/Carts");
const menu = require("../models/menu");

// Add to cart function
router.post("/addtocart", async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log(token)
        if (!token){
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const userId = decoded.userId;
        // Take data from req body to upload to cart
        const { itemId, quantity, canteenId } = req.body;

        const itemInfo = await menu.findOne({ _id: itemId });
        if (!itemInfo) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Check if the item already exists in the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart){
            const itemInfo = await menu.findOne({ _id: itemId });
            if (!itemInfo) {
                return res.status(404).json({ error: 'Item not found' });
            }
            console.log(itemInfo.ItemName)
            // Add to cart
            const addItem = new Cart({
                itemId,
                ItemName: itemInfo.ItemName,
                ItemPrice: itemInfo.ItemPrice,
                ItemImage: itemInfo.ItemImage,
                quantity,
                canteenId,
                userId
            });
            console.log(addItem);
            await addItem.save();
            res.status(200).json({ message: "Item added to cart successfully" });
        }
        const existingItem = cart.items.find(item => item.itemId.equals(itemId));
        console.log(existingItem)
        if (existingItem) {
            // If the item exists, update its quantity
            existingItem.quantity += quantity;
            await cart.save();
        } else {
            // If the item doesn't exist, add it to the cart
            const itemInfo = await menu.findOne({ _id: itemId });
            if (!itemInfo) {
                return res.status(404).json({ error: 'Item not found' });
            }

            // Add to cart
            const addItem = new Cart({
                itemId,
                ItemName: itemInfo.ItemName,
                ItemPrice: itemInfo.ItemPrice,
                ItemImage: itemInfo.ItemImage,
                quantity,
                canteenId,
                userId
            });
            await addItem.save();
        }

        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete from cart function
router.delete("/deletefromcart", async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { itemId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!cart) {
            throw new Error("Cart not found for the user");
        }

        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
