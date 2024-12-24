const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const goth = require('../models/goth')
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

// Signup route - local authentication
router.post('/register', async (req, res) => {

    try {
        //extract the request recieved from frontend into following variables.
        const { userName, email, password } = req.body;

        // Checks if username, email and password are provided and if they are unique
        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        
        //old - reroute to login
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered' });//409-conflict
        }

        //new - hash the password and store in db
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // generate token and send through response
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
        localStorage.setItem('token', token);
        return res.status(201).json({ token });

    } 

    catch (error) {
        //any other error based on logic or internal error.
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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });//401-unauth
        }

        //if email exists - compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
        console.log(token);
        return res.status(200).json({ token });

    } 
    catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

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
