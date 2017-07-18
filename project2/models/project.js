const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    contributors: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, // default: creator (or 1st author)
    goal: String,
    deadline: Date,
    keywords: [String],
    skills: [String],
    isPublished: {
        type: Boolean,
        default: false
    },
    pdfUrl: {
        type: String,
        default: "https://www.researchgate.net"
    },
});

ProjectSchema.set('timestamps', true);

const Project = mongoose.model('Project', ProjectSchema);

module.express = Project;
