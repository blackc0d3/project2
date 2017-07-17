const UsersController = require('../controllers/users_controller');

module.exports = (app) => {
    // Watch for incoming requests of method GET to the route http://localhost:3050/api
    app.get('/api', UsersController.greeting);  // greeting is created in the drivers_controller.js file

    app.post('/api/users', UsersController.create); // create is created in the drivers_controller.js file
    app.put('/api/users/:id',UsersController.edit);  // :id - wildcard   match any route that has a put type request that matches with '/api/drivers/####...###'  (epxreess parses the url to the object automatically)   // edit is created in drivers_controller.js
    app.delete('/api/users/:id',UsersController.delete);  // delete functions is created in drivers_controller.js
    app.get('/api/users',UsersController.index);  // list of records // created in drivers_controller.js
};



//  /profile                // user's profile
//  /profile/edit           // edit users's profile
//  /profile/projects       // user's projects
//  /profile/newproject     // new project

//  /information            // readmore
//  /index                  // homepage
//  /authentication         // singup login logout
