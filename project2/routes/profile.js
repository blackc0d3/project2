const express           = require('express');
const router            = express.Router();
const moment            = require('moment');
const {ensureLoggedIn}  = require('connect-ensure-login');
const multer            = require('multer');

// Models
const Project           = require('../models/project');
const User              = require('../models/user');
const campusTypes       = require('../models/campus-types');
const departmentTypes   = require('../models/department-types');
const Picture           = require('../models/pictures');

// Upload pictures
const upload = multer({ dest: './public/uploads/' });


router.get('/edit', (req, res) => {
    res.render('profile/edit', {
        campusTypes,
        departmentTypes
    });
});

router.get('/projects', (req, res) => {
    Project
        .find({})
        .populate('admin')
        .exec((err, projects) => {
            res.render('profile/allprojects', {
                projects
            });
        });
});

router.get('/newproject', (req, res) => {
    res.render('profile/newproject');
});

router.post('/project', ensureLoggedIn('/login'), (req, res, next) => {
    console.log("Dentro del post", req.body); // REVISAR
    const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        goal: req.body.goal,
        keywords: req.body.keywords,
        deadline: req.body.deadline,

        admin: req.user._id // the user who registers the project
    });

    console.log("NEWPROJECT", newProject); // REVISAR

    newProject.save((err) => {
        if (err) {
            res.render('profile/newproject', {
                project: newProject
            });
        } else {
            res.redirect(`/profile/${newProject._id}`);
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
            return res.render('profile/show', {
                project
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
        return res.redirect('/profile');
    });
});

router.post('/', upload.single('photo'), function(req, res){
    const filename  = req.file.filename;
    const extension = req.file.mimetype.split('/')[1];
    
    let pic;
    pic = new Picture({
        name: req.body.name,
        pic_path: `/uploads/${filename}.${extension}`,
        pic_name: req.file.originalname
    });

    //    const userId = req.user._id;
    //    const update = {
    //        img: req.file.filename
    //    };
    //    console.log(update);
    pic.save((err) => {
        res.redirect('/information');
    });
});

router.get('/', function(req, res, next) {
  Picture.find((err, pictures) => {
    res.render('profile', {pictures})
  })
});


module.exports = router;
