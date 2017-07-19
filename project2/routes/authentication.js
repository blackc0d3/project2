//Packages
const express = require('express');
const router  = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const bcrypt     = require("bcrypt");
const ensureLogin = require("connect-ensure-login");
//const flash              = require("connect-flash");

// Models
const User       = require("../models/user");

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("profile/profile", { user: req.user });
});


// Sign up
router.get('/signup', (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup'
}));


// Log in
router.get('/login', (req, res) => {
    console.log(req.session);
    res.render('authentication/login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login'
}));


// Log out
router.post('/logout', ensureLoggedIn('/login'),(req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;