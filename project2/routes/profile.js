const express = require('express');
const router  = express.Router();
const Project = require('../models/project');

const campusTypes         = require('../models/campus-types');
const departmentTypes     = require('../models/department-types');
const { ensureLoggedIn }  = require('connect-ensure-login');

/* GET home page. */
router.get('/', (req, res) => {
  //res.render('profile/profile');
  res.render('profile');
});

router.get('/edit', (req, res) => {
    res.render('profile/edit',{ campusTypes, departmentTypes });
});

router.get('/projects', (req, res) => {
    Project
        .find({})
        .populate('admin')
        .exec((err, projects) => {
            res.render('profile/allprojects', { projects });
        });
});

router.get('/newproject', (req, res) => {
    console.log("ESTE ES EL RENDER"); // REVISAR
    res.render('profile/newproject');
});

router.post('/project', ensureLoggedIn('/login'), (req, res, next) => {
    console.log("Dentro del post", req.body);   // REVISAR
    const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        goal: req.body.goal,
        keywords: req.body.keywords,
        deadline: req.body.deadline,

        admin: req.user._id // the user who registers the project
    });
    
    console.log("NEWPROJECT", newProject);   // REVISAR

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
router.get('/project/:id',  (req, res, next) => {   //findProject('id'),
  Project.findById(req.params.id, (err, project) => {
    if (err){ return next(err); }

    project.populate('_admin', (err, project) => {
      if (err){ return next(err); }
      return res.render('profile/show', { project });
    });
  });
});





module.exports = router;