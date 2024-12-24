const express = require('express');
const router = express.Router();
const protectRoute = require('../middleware/isAuth');
//route for homepage
router.post('/getownerU', (req, res, next) => {
    // Pass the req object to the protectRoute middleware
    protectRoute(req, res, next);
}, (req, res) => {

    if (res.statusCode === 200) {
        res.redirect("http://localhost:3000/ownerU");
        console.log("common accessed");
    } else {

        res.redirect("http://localhost:3000/ownerL");
    }
});
//route for owner's menu page
router.post('/getownerM', (req, res, next) => {
    // Pass the req object to the protectRoute middleware
    protectRoute(req, res, next);
}, (req, res) => {
    if (res.statusCode === 200) {
        res.redirect("http://localhost:3000/ownerM");
        console.log("commonroute accessed");
    } else {
        res.redirect("http://localhost:3000/ownerL");
    }
});
router.post('/getcan', (req, res, next) => {
    // Pass the req object to the protectRoute middleware
    protectRoute(req, res, next);
}, (req, res) => {

    if (res.statusCode === 200) {
        res.redirect("http://localhost:8000/getCanteens");
        console.log("common accessed");
    } else {

        res.redirect("http://localhost:3000/login");
    }
});
module.exports = router;
