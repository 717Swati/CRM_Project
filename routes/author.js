const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/auth');
const upload = require('../config/multer');

// console.log('authorController:', authorController);
// Author dashboard
router.get('/dashboard', ensureAuthenticated, authorizeRoles('Author'), authorController.dashboard);

// Display form to submit a new paper
router.get('/papers/new', ensureAuthenticated, authorizeRoles('Author'), authorController.newPaperForm);

// Handle paper submission
router.post('/papers', ensureAuthenticated, authorizeRoles('Author'), upload.single('paper'), authorController.submitPaper);

// View individual paper
router.get('/papers/:id', ensureAuthenticated, authorizeRoles('Author'), authorController.viewPaper);

// List all submitted papers
router.get('/papers', ensureAuthenticated, authorizeRoles('Author'), authorController.listPapers);

module.exports = router;