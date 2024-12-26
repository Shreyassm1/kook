const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const goth = require('../models/goth');
const { generateRefreshToken, generateAccessToken } = require('../utils/generateToken');
const verifyJWT = require('../middleware/isAuth');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

//passport set up for google authentication 
passport.use(new GoogleStrategy({
    //client crendentials ......
    clientID: '472353109993-bvebi129jggs6rbcmfru3mel9ufnrknf.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'

}, async function(accessToken, refreshToken, profile, done) {

    try {
        //find any user with provided data in g-auth users db then apply the following conditions.
        let existingUser = await goth.findOne({ email : profile.emails[0].value });
        
        if (existingUser) {
            return done(null, existingUser);
        } 
        else {
            const newUser = new goth({
                googleId: profile.id,
                userName: profile.displayName, 
                displayName: profile.displayName,
                email: profile.emails[0].value
            });
            await newUser.save();
            return done(null, newUser);
        }
    } 

    catch (err) {
        return done(err);
    }

}));

//serialize passport - give unique id
passport.serializeUser((user, done) => {
    done(null, user.id);//(err,info)
});

//retrieves info using unique id
passport.deserializeUser((id, done) => {
    goth.findById(id, (err, user) => {
        done(err, user);
    });
});

//access and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = generateRefreshToken(userId);
        const accessToken = generateAccessToken(userId);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new Error('Something went wrong while generating access and refresh tokens.');
    }
};


// Signup route - local authentication
router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        // Check if a user with this username already exists
        const existingUsername = await User.findOne({ userName });
        if (existingUsername) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error('Error in signup route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Login route for local authentication
router.post('/login', async (req, res) => {
    try {
        //recieved req has email and password - username caused issues with db.
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });//$or: [{username},{password}]

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });//401-unauth
        }

        //if email exists - compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const{accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({message: "User logged in successfully"})

    } 
    catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.post("/logout",verifyJWT, async(req,res) => {  

        User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { refreshToken: null }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({message: "User logged out successfully"})

});

// OAuth2 authentication route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        const redirectUrl = 'http://localhost:3000/home';
        res.redirect(redirectUrl);
    }
);

module.exports = router;
