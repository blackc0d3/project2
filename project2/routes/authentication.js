// routes/authentication.js
const express = require('express');
const router = express.Router();
const passport = require("passport");

const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// User model
const User = require('../models/user');

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
            res.redirect('/profile/profile');
        }
    });
});

// Sign In
router.get('/login', (req, res, next) => {
    res.render('authentication/login');
});

router.post('/login', passport.authenticate('local-login', {  // local-login is in the app.js file in passport.use configuration!
    successRedirect: '/profile/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));



router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login');
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
