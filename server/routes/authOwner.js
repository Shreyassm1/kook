const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const verifyOwner = require("../middleware/isOwner");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/generateToken");

//access and refresh token
const generateAccessAndRefreshTokens = async (ownerId) => {
  try {
    const user = await Owner.findById(ownerId);
    const refreshToken = generateRefreshToken(ownerId);
    const accessToken = generateAccessToken(ownerId);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

require("dotenv").config();

// Signup route - local authentication
router.post("/registerOwner", async (req, res) => {
  try {
    // Extract the request received from frontend into the following variables
    const { username, email, password } = req.body;
    console.log("Received registration request:", req.body);

    // Checks if username, email, and password are provided and if they are unique
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(409).json({ error: "Email is already registered" }); // 409 - conflict
    }

    // Hash the password and store in DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({
      username,
      email,
      password: hashedPassword,
      hasCanteen: false, // Initialize the owner with no canteen
    });

    await newOwner.save();
    return res.status(200).json({ message: "Owner Registered" });
  } catch (error) {
    console.error("Error in signup route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route for local authentication
router.post("/loginOwner", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, owner.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      owner._id
    );
    const hasCanteen = owner.hasCanteen;
    const canteenId = owner._id;
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ hasCanteen, canteenId });
  } catch (error) {
    console.error("Error in login route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logoutOwner", verifyOwner, async (req, res) => {
  try {
    Owner.findByIdAndUpdate(
      req.owner._id,
      {
        $set: { refreshToken: null },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/refreshTokenOwner", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "User not logged in" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const ownerId = decoded.id;

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (owner.refreshToken !== refreshToken) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(ownerId);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in refresh token route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
