// Packages
const express = require('express');
const router = express.Router();

// Models
const Project = require('../models/project');

/* GET home page. */
router.get('/', function (req, res, next) {
    Project
        .find({})
        .populate('admin')
        .exec((err, projects) => {
            res.render('index', {
                projects
            });
        });
});

module.exports = router;

