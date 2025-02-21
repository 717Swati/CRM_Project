// routes/reviewer.js
const express = require('express');
const router = express.Router();
const reviewerController = require('../controllers/reviewerController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/auth');

// routes/reviewer.js (Add to existing reviewer routes)
router.get('/dashboard', ensureAuthenticated, authorizeRoles('Reviewer'), reviewerController.dashboard);


// View Assigned Papers
router.get('/papers', ensureAuthenticated, authorizeRoles('Reviewer'), reviewerController.listAssignedPapers);

// Submit Review Form
router.get('/papers/:id/review', ensureAuthenticated, authorizeRoles('Reviewer'), reviewerController.reviewForm);



// Submit Review Handler
router.post('/papers/:id/review', ensureAuthenticated, authorizeRoles('Reviewer'), reviewerController.submitReview);



module.exports = router;