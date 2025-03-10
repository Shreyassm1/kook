const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const verifyOwner = require("../middleware/isOwner");

router.delete("/deleteItem/:itemId", verifyOwner, async (req, res) => {
  try {
    if (!req.owner) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const itemId = req.params.itemId;
    const deletedItem = await Menu.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// router.post("/updateItem", verifyOwner, async (req, res) => {
//   try {
//     if (!req.owner) {
//       return res.status(401).json({ error: "Unauthorized access" });
//     }

//     const { itemPrice, itemDescription, itemImage } = req.body;
//     await Menu.updateOne(
//       { itemId: req.item._id },
//       {
//         $set: {
//           ItemPrice: itemPrice,
//           ItemDescription: itemDescription,
//           ItemImage: itemImage,
//         },
//       }
//     );
//     res.status(200).json({ message: "item updated" });
//   } catch (error) {
//     console.error("Error fetching item:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// });

module.exports = router;
