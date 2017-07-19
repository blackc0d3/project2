const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const campusTypes = require('./campus-types');
const departmentTypes = require('./department-types');

const UserSchema = new Schema({
    name: String,
    lastname: String,
    campus: campusTypes,
    department: departmentTypes,
    telephone: Number,
    email: String,
    username: String,
    password: String,
    description: String,
    img: String, 
    pic_path: String,
    pic_name: String,
    skills: [{
        type: String
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
