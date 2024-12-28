const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/isAuth");
const User = require("../models/User");

router.get("/getStudent", verifyJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const student = await User.findById(req.user.id);
    res.json(student);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
