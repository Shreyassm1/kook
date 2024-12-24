const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const app = express();
const auth = require('./routes/authStudent');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: 'fstiwrhsb', resave: false, saveUninitialized: false }));
app.use('/register', auth);
app.use('/ownerPost',auth);
// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

fs.readdirSync('./routes').map((r)=> app.use(require('./routes/' + r)));
mongoose
  .connect("mongodb+srv://altshreyas:fstiwrhsb@cluster0.kjs4euw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err))
  
const port = process.env.PORT || 8000;
const server = app.listen(port,()=> console.log(`server is running ${port}`));

