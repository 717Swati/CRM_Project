const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conference: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true },
    file: { type: String, required: true },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected'],
        default: 'Submitted',
    },
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    submissionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Paper', paperSchema);