// controllers/adminController.js

const Conference = require('../models/Conference');
const Paper = require('../models/Paper');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');


// Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const conferences = await Conference.find().sort({ submissionDeadline: 1 });
        res.render('admin/dashboard', { conferences });
    } catch (err) {
        console.error('Error loading admin dashboard:', err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
};

// Display form to create new conference
exports.newConferenceForm = (req, res) => {
    res.render('admin/newConference');
};

// Create new conference
exports.createConference = async (req, res) => {
    const { title, description, submissionDeadline } = req.body;
    try {
        const conference = new Conference({ title, description, submissionDeadline });
        await conference.save();
        req.flash('success_msg', 'Conference created successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error creating conference:', err);
        req.flash('error_msg', 'Error creating conference');
        res.redirect('/admin/conferences/new');
    }
};


// Display form to edit conference
exports.editConferenceForm = async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id);
        if (!conference) {
            req.flash('error_msg', 'Conference not found');
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/editConference', { conference });
    } catch (err) {
        console.error('Error loading conference:', err);
        req.flash('error_msg', 'Error loading conference');
        res.redirect('/admin/dashboard');
    }
};



// Update conference
exports.updateConference = async (req, res) => {
    const { title, description, submissionDeadline } = req.body;
    try {
        await Conference.findByIdAndUpdate(req.params.id, {
            title,
            description,
            submissionDeadline,
        });
        req.flash('success_msg', 'Conference updated successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error updating conference:', err);
        req.flash('error_msg', 'Error updating conference');
        res.redirect('/admin/dashboard');
    }
};

// Delete conference
exports.deleteConference = async (req, res) => {
    try {
        await Conference.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Conference deleted successfully');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error deleting conference:', err);
        req.flash('error_msg', 'Error deleting conference');
        res.redirect('/admin/dashboard');
    }
};

exports.listConferences = async (req, res) => {
    try {
        const conferences = await Conference.find();
        res.render('admin/conferences', { conferences });
    } catch (err) {
        console.error('Error fetching conferences:', err);
        req.flash('error_msg', 'Error fetching conferences');
        res.redirect('/admin/dashboard');
    }
};


// List all submitted papers
exports.listPapers = async (req, res) => {
    try {
        const papers = await Paper.find().populate('author').populate('conference').populate({
            path: 'reviews',
            populate: {
                path: 'reviewer',
                model: 'User',
                select: 'name'
            }
        });

        const reviewers = await User.find({ role: 'Reviewer' });

        const reviewersMap = new Map();
        reviewers.forEach(reviewer => {
            reviewersMap.set(reviewer._id.toString(), reviewer.name);
        });

        res.render('admin/papers', { papers, reviewers, reviewersMap });
    } catch (err) {
        console.error('Error listing papers:', err);
        req.flash('error_msg', 'Error loading papers');
        res.redirect('/admin/dashboard');
    }
};

// Assign a role to a user
exports.assignRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // 'Admin', 'Reviewer', or 'Author'

    try {
        await User.findByIdAndUpdate(id, { role });
        req.flash('success_msg', ` User role updated to ${role}`);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error assigning role:', err);
        req.flash('error_msg', 'Error assigning role');
        res.redirect('/admin/dashboard');
    }
};


// Assign paper to reviewer
exports.assignPaper = async (req, res) => {
    const { paperId } = req.params;
    const { reviewerId } = req.body;

    try {
        const paper = await Paper.findById(paperId);
        if (!paper.reviewers.includes(reviewerId)) {
            paper.reviewers.push(reviewerId);
            await paper.save();
            req.flash('success_msg', 'Reviewer assigned successfully');
        } else {
            req.flash('error_msg', 'Reviewer already assigned to this paper');
        }
        res.redirect('/admin/papers');
    } catch (err) {
        console.error('Error assigning paper:', err);
        req.flash('error_msg', 'Error assigning paper');
        res.redirect('/admin/papers');
    }
};

// Make decision on paper
exports.makeDecision = async (req, res) => {
    const { paperId } = req.params;
    const { decision } = req.body; // 'Accepted' or 'Rejected'

    try {
        const paper = await Paper.findById(paperId).populate('author');
        if (!paper) {
            req.flash('error_msg', 'Paper not found');
            return res.redirect('/admin/papers');
        }

        paper.status = decision;
        await paper.save();

        // Send email notification to the author
        const authorEmail = paper.author.email;
        const subject = `Your paper "${paper.title}" has been ${decision}`;
        const text = `Dear ${paper.author.name}, \n\nYour paper titled "${paper.title}" has been ${decision}.\n\nBest regards, \nConference Management Team`;

        await sendEmail(authorEmail, subject, text);

        req.flash('success_msg', `Paper has been ${decision.toLowerCase()}`);
        res.redirect('/admin/papers');
    } catch (err) {
        console.error('Error making decision on paper:', err);
        req.flash('error_msg', 'Error making decision on paper');
        res.redirect('/admin/papers');
    }
};

// Download paper
exports.downloadPaper = async (req, res) => {
    const { paperId } = req.params;

    try {
        const paper = await Paper.findById(paperId);
        const filePath = path.join(__dirname, '..', 'public', paper.file);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading paper:', err);
                req.flash('error_msg', 'Error downloading paper');
                res.redirect('/admin/papers');
            }
        });
    } catch (err) {
        console.error('Error finding paper for download:', err);
        req.flash('error_msg', 'Error downloading paper');
        res.redirect('/admin/papers');
    }
};