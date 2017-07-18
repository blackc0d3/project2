// routes/authentication.js
const express = require('express');
const router = express.Router();
const passport = require("passport");

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// User model
const User = require('../models/user');
const Project = require('../models/project');

// Sign Up
router.get('/signup', (req, res, next) => {
    res.render('authentication/signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username; // obtained from the form (/views/authentication/signup)
    const password = req.body.password;
    const email = req.body.email;

    if (username === "" || password === "" || email === "") {
        res.render('authentication/signup', {
            message: "Indicate username, password and a valid email"
        });
        return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = User({
        username: username,
        password: hashPass,
        email: email
    });
    
    newUser.save((err)=>{
        if(err){
            res.render('authentication/signup', {message:"Something went wrong"});
        } else {
            res.redirect('/');
        }
    });
});


// Sign In
router.get('/login', (req, res, next) => {
    res.render('authentication/login', {message:req.flash("error")});
});

router.post('/login', passport.authenticate('local-login', {  // local-login is in the app.js file in passport.use configuration!
    successRedirect: '/private/projects',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));


// Private content (projects)  -- web where some content and options are shown 

router.get('/projects', ensureLoggedIn(), (req, res, next) => {
  res.render("/profile/profile", { user: req.user });
});


// Privileges if they're logged in  -- create new project
router.get('/new', ensureLoggedIn(), (req, res, next) => {
  res.render("/profile/newproject", { user: req.user });
});

router.post('/projects', ensureLoggedIn(), (req, res, next) => {
    const newProject = new Project ({
        name:  req.body.title,
        description:  req.body.description,
        contributors: req.body.contributors,
        admin: req.user._id,   // <-- we add the user ID
        goal: req.body.goal,
        deadline: req.body.deadline,
        keywords: req.body.keywords,
        skills: req.body.skills
    });
});


// Log Out
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

//router.post('/logout', (req, res) => {
//    req.logout();
//    res.redirect('/');
//});

module.exports = router;
