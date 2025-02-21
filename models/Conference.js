// models/Conference.js
const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    submissionDeadline: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Conference', conferenceSchema);