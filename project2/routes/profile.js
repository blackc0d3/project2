const express = require('express');
const router = express.Router();
const moment = require('moment');
const {
    ensureLoggedIn
} = require('connect-ensure-login');
const multer = require('multer');

// Models
const Project = require('../models/project');
const User = require('../models/user');
const campusTypes = require('../models/campus-types');
const departmentTypes = require('../models/department-types');
const Picture = require('../models/pictures');

// Upload pictures
const upload = multer({
    dest: './public/uploads/'
});

router.get('/edit', (req, res) => {
    res.render('profile/edit', {
        campusTypes,
        departmentTypes
    });
});

// All the projects
router.get('/projects', (req, res) => {
    Project
        .find({})
        .populate('admin')
        .exec((err, projects) => {
            // CHECK KIND OF PROJECT 
            // ADD A NEW KEY FOR THE IMAGE TYPE
            res.render('profile/allprojects', {
                projects
            });
        });
});


// All the projects of one user
router.get('/myprojects', (req, res) => {
    User
        .findById(req.user._id)
        .populate('projects')
        .exec((err, users) => {
            res.render('profile/myprojects', {
                users
            });
        });
});





router.get('/newproject', (req, res) => {
    res.render('profile/newproject');
});

router.post('/project', ensureLoggedIn('/login'), (req, res, next) => {
//    const shortDate = new Date();
//    dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    
    

    
    const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        goal: req.body.goal,
        keywords: req.body.keywords,
        deadline: req.body.deadline,

        admin: req.user._id, // the user who registers the project
        contributors: req.user._id // the admin is also a contributor 
    });
    
    

    newProject.save((err) => {
        if (err) {
            res.render('profile/newproject', {
                project: newProject
            });
        } else {
            User
                .findById(req.user._id)
                .exec((err, user) => {
                    user.projects.push(newProject);
                    user.save();
                    res.redirect(`/profile/project/${newProject._id}`);
            });
        }
    });
});


// "/:projectID"
router.get('/project/:id', (req, res, next) => {
    Project.findById(req.params.id, (err, project) => {
        if (err) {
            return next(err);
        }

        project.populate('_admin', (err, project) => {
            if (err) {
                return next(err);
            }
            Picture.find((err, pictures) => {
                var lastPic = pictures[pictures.length - 1];
                res.render('profile/show', {
                    picture: lastPic,
                    project
                });
            });

        });
    });
});

router.post('/edit', (req, res, next) => {
    const userId = req.user._id;

    const updates = {
        name: req.body.name,
        lastname: req.body.lastname,
        telephone: req.body.telephone,
        campus: req.body.campus,
        department: req.body.department,
        skills: req.body.skills
    };

    User.findByIdAndUpdate(userId, updates, (err, user) => {
        if (err) {
            return res.render('profile/edit', {
                user,
                errors: user.errors
            });
        }
        if (!user) {
            return next(new Error("404"));
        }
        return res.redirect('/profile/myprofile');
    });
});


// Profile
router.post('/', upload.single('photo'), function (req, res, next) {
    const userId = req.user._id;
    const filename = req.file.filename;

    let pic;
    pic = new Picture({
        name: req.body.name,
        pic_path: `/uploads/${filename}`,
        pic_name: req.file.originalname
    });

    var filePath = {
        pic_path: `/uploads/${filename}`
    };
    


    pic.save((err) => {
        User.findByIdAndUpdate(userId, filePath, {
            new: true
        }, (err, user) => {
            if (err) {
                return res.render('profile/edit', {
                    user,
                    errors: user.errors
                });
            }
            if (!user) {
                return next(new Error("404"));
            } 
            return res.redirect('/profile');
        });
    });
});


// My profile details
router.get('/myprofile', (req, res) => {
    var user = req.user;

    Picture.find((err, pictures) => {
        var lastPic = pictures[pictures.length - 1];
        res.render('profile/myprofile', {
            user,
            picture: lastPic
        });
    });
});

module.exports = router;
