const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const passport = require("passport");
// const goth = require("../models/goth");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../utils/generateToken");
const verifyJWT = require("../middleware/isAuth");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "472353109993-bvebi129jggs6rbcmfru3mel9ufnrknf.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "/auth/google/callback",
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       try {
//         let existingUser = await goth.findOne({
//           email: profile.emails[0].value,
//         });

//         if (existingUser) {
//           return done(null, existingUser);
//         } else {
//           const newUser = new goth({
//             googleId: profile.id,
//             userName: profile.displayName,
//             displayName: profile.displayName,
//             email: profile.emails[0].value,
//           });
//           await newUser.save();
//           return done(null, newUser);
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   goth.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = generateRefreshToken(userId);
    const accessToken = generateAccessToken(userId);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating access and refresh tokens."
    );
  }
};

router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400) //Bad Request
        .json({ error: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409) //Conflict - existing user
        .json({ error: "Email is already registered" });
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res
        .status(409) //Conflict - existing username
        .json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201) //Created - led to creation of a resource.
      .json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error in signup route:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400) //Bad Request
        .json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401) //Unauthorized user
        .json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401) //Unauthorized user
        .json({ error: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .status(200) //OK
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in login route:", error);
    return res
      .status(500) //Internal Server Error
      .json({ error: "Internal Server Error" });
  }
});

router.post("/logout", verifyJWT, async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
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
    sameSite: "None",
  };
  return res
    .status(200) //OK
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
});

router.post("/refresh-token", verifyJWT, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "User not logged in" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(userId);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in refresh token route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     const redirectUrl = "http://localhost:3000/home";
//     res.redirect(redirectUrl);
//   }
// );

module.exports = router;
