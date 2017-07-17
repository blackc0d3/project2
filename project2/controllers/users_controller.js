const User = require('../models/user'); // we call it since the users_collection_test was crashing

module.exports = {
    greeting(req, res) {
        res.send({
            hi: 'there'
        });
    },
    
    index(req,res,next){   // the req will contain the lng and lat info  // we will look at the req.query instead req.body
        const {lng,lat} = req.query;   // 'http://google.com?lng=80&lat=20'   everything after the ? is a query
        User.geoNear(
            {type:'Point', coordinates:[parseFloat(lng), parseFloat(lat)]},  // point that we want to center on  // parseFloat is to convert the lng and lat into numbers (since epxress considers them as strings)
            {spherical:true, maxDistance:200000}   // units in meters (200000 = 200 km)
        )
            .then(users => res.send(users))
            .catch(next);
    },

    create(req, res, next) {
        const userProps = req.body;
        User.create(userProps)
            .then(user => res.send(user)) // create the user and send it to who did the request (the own user)
            .catch(next);
    },

    edit(req, res, next) {
        const userId = req.params.id; // this id is the same of the :id wildcard  -- name could have been any :userId and then req.params.userId // params object can have multiple properties
        const userProps = req.body;

        User.findByIdAndUpdate({_id: userId}, userProps)  // find the user and update its props
            .then(()=>User.findById({_id:userId})) // we find the user who updated the info and then send it to it
            .then(user=>res.send(user))
            .catch(next);
    },
    
    delete(req,res,next) {
        const userId = req.params.id;
                
        User.findByIdAndRemove({ _id: userId })
            .then(user => res.status(204).send(user))  // 204 - element successfully removed
            .catch(next);
    }
};
