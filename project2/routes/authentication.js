const express = require('express');
const router  = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const User       = require("../models/user");
const bcrypt     = require("bcrypt");
const ensureLogin = require("connect-ensure-login");
const flash              = require("connect-flash");

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("profile/profile", { user: req.user });
});

router.get('/signup', (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup'
}));


router.get('/login', (req, res) => {
    console.log(req.session);
    res.render('authentication/login');
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login'
}));

router.post('/logout', ensureLoggedIn('/login'),(req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;