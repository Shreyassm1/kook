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
    await user.save();

    return { refreshToken, accessToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

require("dotenv").config();

//-----------------------------------------------------------OWNER REGISTER FLOW-------------------------------------------------------
//1.Take registration info from user.(assuming frontend sends some sort of value in each field)
//2.Check if user with above credentials already exists or not.
//3.If False --> return status 409, conflict.
//4.Encrypt the password before saving to db.
//5.Save data to user model.
//6.Return status 200.
//------------------------------------------------------------------------------------------------------------------------------------

router.post("/registerOwner", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log("Received registration request:", req.body);

    if (!username || !email || !password) {
      return res
        .status(400) //Bad Request error
        .json({ error: "Username, email, and password are required" });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res
        .status(409) //conflict error
        .json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new Owner({
      username,
      email,
      password: hashedPassword,
      // hasCanteen: false, --> already defaulted to false in model.
    });

    await newOwner.save();
    return res
      .status(200) //OK
      .json({ message: "Owner Registered successfully" });
  } catch (error) {
    // console.error("Error in signup route:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal Server Error" });
  }
});

//-----------------------------------------------------------OWNER LOGIN FLOW----------------------------------------------------------
//1.Take login details from user.(Assuming frontend sends valid values for all required fields.)
//2.Check whether email exists in the user db.
//3.If False --> return status 401, unauthorized.
//4.decrypt the password and compare with the password in login data.
//5.If False --> return status 401, password invalid, unauthorized.
//6.Generate Access and Refresh Tokens:
//(a)Access Tokens contain user id, username and email for easy access and authentication.
//(b)Refresh Token contain user id and is saved in the db for future reference and use.
//7.Return status 200 with the above tokens passed into the cookies.
//------------------------------------------------------------------------------------------------------------------------------------

router.post("/loginOwner", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400) //Bad request
        .json({ error: "Email and password are required" });
    }

    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res
        .status(401) //Unauthorized - lacks valid authentication credentials.
        .json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, owner.password);
    if (!passwordMatch) {
      return res
        .status(401) //Unauthorized - password is invalid.
        .json({ error: "Invalid email or password" });
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
      .status(200) //success
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ hasCanteen, canteenId });
  } catch (error) {
    console.error("Error in login route:", error);
    return res
      .status(500) // Internal Server Error
      .json({ error: "Internal Server Error" });
  }
});

//-----------------------------------------------------------OWNER LOGOUT FLOW----------------------------------------------------------
//1.Set refreshToken to null after logout.
//2.Clear cookies - refresh and access token.
//Model.findByIdAndUpdate(id, update, options, callback);
//--------------------------------------------------------------------------------------------------------------------------------------

router.post("/logoutOwner", verifyOwner, async (req, res) => {
  try {
    Owner.findByIdAndUpdate(
      req.owner._id,
      {
        $set: { refreshToken: null },
      },
      {
        new: true, //returns new updated object instead of original, when set to true.
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200) //success
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout route:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal Server Error" });
  }
});

//-----------------------------------------------------------REFRESH TOKEN FLOW----------------------------------------------------------
//1.Check for refresh token in cookies.
//2.If FALSE --> owner is not logged in (refresh token removed on logout).
//3.Decode token and retrieve ownerID.
//4.FindById refresh token and match with refresh token from cookie.
//5.If FALSE --> invalid token.
//6.Log in owner without authentication(session has not expired).
//--------------------------------------------------------------------------------------------------------------------------------------

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
