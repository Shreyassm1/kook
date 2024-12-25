const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');
require('dotenv').config();

// Signup route - local authentication
router.post('/registerOwner', async (req, res) => {

    try {
        //extract the request recieved from frontend into following variables.
        const { username, email, password } = req.body;
        console.log('Received registration request:', req.body);

        // Checks if username, email and password are provided and if they are unique
        if (!username || !email || !password) {
            console.log('check1')
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        const existingOwner = await Owner.findOne({ email });
        console.log('check2')
        //old - reroute to login
        if (existingOwner) {
            return res.status(409).json({ error: 'Email is already registered' });//409-conflict
        }
        console.log('creating owner')
        //new - hash the password and store in db
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = new Owner({
            username,
            email,
            password: hashedPassword
        });
        await newOwner.save();
        return res.status(200).json({message:"Owner Registered"});
    } 

    catch (error) {
        //any other error based on logic or internal error.
        console.error('Error in signup route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Login route for local authentication
router.post('/loginOwner', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const owner = await Owner.findOne({ email });

        if (!owner) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, owner.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
        res.setHeader('Authorization', 'Bearer ' + token);
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error in login route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
