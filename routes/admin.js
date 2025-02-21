// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/auth');

// routes/admin.js

// console.log('adminController:', adminController);

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, authorizeRoles('Admin'), adminController.dashboard);

// Create Conference
router.get('/conferences/new', ensureAuthenticated, authorizeRoles('Admin'), adminController.newConferenceForm);
router.post('/conferences', ensureAuthenticated, authorizeRoles('Admin'), adminController.createConference);

// Manage Conferences
router.get('/conferences', ensureAuthenticated, authorizeRoles('Admin'), adminController.listConferences);

// Edit Conference
router.get('/conferences/:id/edit', ensureAuthenticated, authorizeRoles('Admin'), adminController.editConferenceForm);
router.put('/conferences/:id', ensureAuthenticated, authorizeRoles('Admin'), adminController.updateConference);

// Assign Papers
router.get('/papers', ensureAuthenticated, authorizeRoles('Admin'), adminController.listPapers);
router.post('/papers/:paperId/assign', ensureAuthenticated, authorizeRoles('Admin'), adminController.assignPaper);

// Accept/Reject Papers
router.post('/papers/:paperId/decision', ensureAuthenticated, authorizeRoles('Admin'), adminController.makeDecision);

// Download Paper
router.get('/papers/:paperId/download', ensureAuthenticated, authorizeRoles('Admin'), adminController.downloadPaper);


// Delete Conference
router.delete('/conferences/:id', ensureAuthenticated, authorizeRoles('Admin'), adminController.deleteConference);

// Assign Roles
router.post('/users/:id/role', ensureAuthenticated, authorizeRoles('Admin'), adminController.assignRole);



module.exports = router;