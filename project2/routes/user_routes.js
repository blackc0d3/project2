const UsersController = require('../controllers/users_controller');

module.exports = (app) => {
    // Watch for incoming requests of method GET to the route http://localhost:3050/api
    app.get('/api/users',UsersController.index);  // list of records // created in drivers_controller.js

    app.post('/api/users', UsersController.create); // create is created in the drivers_controller.js file
    app.put('/api/users/:id',UsersController.edit);  // :id - wildcard   match any route that has a put type request that matches with '/api/drivers/####...###'  (epxreess parses the url to the object automatically)   // edit is created in drivers_controller.js
    app.delete('/api/users/:id',UsersController.delete);  // delete functions is created in drivers_controller.js
    
};




const express = require('express');
const router  = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

router.get('/signup', (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile/profile',
  failureRedirect : '/signup'
}));

router.get('/login', (req, res) => {
    res.render('authentication/login');
});

router.get('/signup', (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile/profile',
  failureRedirect : '/login'
}));

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login');
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;





//  /profile                // user's profile
//  /profile/edit           // edit users's profile
//  /profile/projects       // user's projects
//  /profile/newproject     // new project

//  /information            // readmore
//  /index                  // homepage
//  /authentication         // singup login logout
