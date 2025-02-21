// routes/test.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/save-test-user', async (req, res) => {
    try {
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password', // This will need to be hashed in your model's pre-save hook
            role: 'Author',
        });
        await testUser.save();
        res.send('Test user saved successfully');
    } catch (err) {
        console.error('Error saving test user:', err);
        res.send('Error saving test user');
    }
});

module.exports = router;