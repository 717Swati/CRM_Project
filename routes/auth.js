// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration Form

router.get('/register', (req, res) => {
    res.render('register', {
        name: '',
        email: '',
        password: '',
        password2: '',
        role: ''
    });
});

// Registration Handler
router.post('/register', authController.registerUser);


// routes/auth.js (continued)

// Login Form
router.get('/login', (req, res) => res.render('login'));

// Login Handler
router.post('/login', authController.loginUser);

// Logout
router.get('/logout', authController.logoutUser);


module.exports = router;