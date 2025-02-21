// controllers/reviewerController.js
const Paper = require('../models/Paper');
const Review = require('../models/Review');
const Conference = require('../models/Conference');
// List assigned papers
exports.listAssignedPapers = async (req, res) => {
    const papers = await Paper.find({ reviewers: req.user.id }).populate('conference');
    res.render('reviewer/papers', { papers });
};

// View individual paper for review
exports.reviewForm = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id).populate('author').populate('conference');
        if (!paper) {
            req.flash('error_msg', 'Paper not found');
            return res.redirect('/reviewer/dashboard');
        }
        res.render('reviewer/reviewForm', { paper });
    } catch (err) {
        console.error('Error loading review form:', err);
        req.flash('error_msg', 'Error loading review form');
        res.redirect('/reviewer/dashboard');
    }
};

// Submit review for a paper
exports.submitReview = async (req, res) => {
    const { comments, score, recommendation } = req.body;
    const paperId = req.params.id;

    try {
        const review = new Review({
            paper: paperId,
            reviewer: req.user._id,
            comments,
            score,
            recommendation,
        });

        await review.save();

        const paper = await Paper.findById(paperId);
        if (!paper.reviews) {
            paper.reviews = [];
        }
        paper.reviews.push(review._id);
        await paper.save();

        req.flash('success_msg', 'Review submitted successfully');
        res.redirect('/reviewer/dashboard');
    } catch (err) {
        console.error('Error submitting review:', err);
        req.flash('error_msg', 'Error submitting review');
        res.redirect(`/reviewer/papers / ${paperId} / review`);
    }
};



// Reviewer Dashboard
exports.dashboard = async (req, res) => {
    try {
        const papers = await Paper.find({ reviewers: req.user._id })
            .populate('author')
            .populate('conference')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'reviewer',
                    model: 'User',
                    select: 'name'
                }
            });

        res.render('reviewer/dashboard', { papers });
    } catch (err) {
        console.error('Error loading dashboard:', err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
};