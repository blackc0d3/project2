const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: String,
    description: String,
    admin: {type: Schema.Types.ObjectId, ref:'User'},  // default: creator (or 1st author)
    contributors: [String],
    keywords: [String], 
    skills: [String],
    status: String
});

ProjectSchema.set('timestamps', true);
const Project = mongoose.model('Project',ProjectSchema);
module.express = Project;