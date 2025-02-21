// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    paper: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper' },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: String,
    score: Number,
    recommendation: { type: String, enum: ['Accept', 'Reject'] },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);