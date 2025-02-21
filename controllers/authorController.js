// controllers/authorController.js

const Paper = require('../models/Paper');
const Conference = require('../models/Conference');

// Author Dashboard
exports.dashboard = async (req, res) => {
    try {
        const papers = await Paper.find({ author: req.user._id }).populate('conference');
        res.render('author/dashboard', { papers });
    } catch (err) {
        console.error('Error loading dashboard:', err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
};

// Display form to submit a new paper
exports.newPaperForm = async (req, res) => {
    const conferences = await Conference.find();
    res.render('author/newPaper', { conferences });
};

// Handle paper submission
exports.submitPaper = async (req, res) => {
    const { title, abstract, conference } = req.body;
    let errors = [];

    if (!title || !abstract || !conference || !req.file) {
        errors.push({ msg: 'Please fill in all fields and upload a paper' });
    }

    if (errors.length > 0) {
        const conferences = await Conference.find();
        return res.render('author/newPaper', { errors, conferences });
    }

    try {
        const paper = new Paper({
            title,
            abstract,
            author: req.user._id,
            conference,
            file: `/uploads/papers / ${req.file.filename}`,
            status: 'Submitted',
        });

        await paper.save();
        req.flash('success_msg', 'Paper submitted successfully');
        res.redirect('/author/papers');
    } catch (err) {
        console.error('Error submitting paper:', err);
        errors.push({ msg: 'An error occurred while submitting your paper' });
        const conferences = await Conference.find();
        res.render('author/newPaper', { errors, conferences });
    }
};

// View individual paper
exports.viewPaper = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id)
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
        if (!paper) {
            req.flash('error_msg', 'Paper not found');
            return res.redirect('/author/dashboard');
        }

        res.render('author/viewPaper', { paper });
    } catch (err) {
        console.error('Error viewing paper:', err);
        req.flash('error_msg', 'Error loading paper');
        res.redirect('/author/dashboard');
    }
};

// List all submitted papers
exports.listPapers = async (req, res) => {
    try {
        // Populate the conference field
        const papers = await Paper.find({ author: req.user._id })
            .populate('conference')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'reviewer',
                    model: 'User',
                    select: 'name'
                }
            });

        // Debugging: Log papers and their conferences
        papers.forEach(paper => {
            console.log(`Paper: ${JSON.stringify(paper, null, 2)}`);
        });

        res.render('author/papers', { papers });
    } catch (err) {
        console.error('Error listing papers:', err);
        req.flash('error_msg', 'Error loading papers');
        res.redirect('/author/dashboard');
    }
};