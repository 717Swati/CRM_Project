// controllers/authController.js
const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, password2, role } = req.body;
    let errors = [];

    // Validate required fields
    if (!name || !email || !password || !password2 || !role) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    // Validate role
    const validRoles = ['Admin', 'Reviewer', 'Author'];
    if (!validRoles.includes(role)) {
        errors.push({ msg: 'Invalid role selected' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            role,
        });
    } else {
        try {
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    role,
                });
            } else {
                // Create new user (password will be hashed in pre-save hook)
                const newUser = new User({
                    name,
                    email,
                    password,
                    role,
                });

                // Save user to database
                await newUser.save();

                req.flash('success_msg', 'You are registered and can log in');
                res.redirect('/auth/login');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            errors.push({ msg: 'An error occurred during registration' });
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2,
                role,
            });
        }
    }
};


// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        req.flash('error_msg', 'Please fill in all fields');
        return res.redirect('/auth/login');
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Email is not registered');
            return res.redirect('/auth/login');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password');
            return res.redirect('/auth/login');
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set cookie
        res.cookie('token', token, { httpOnly: true });

        // Redirect based on role
        res.redirect(`/${user.role.toLowerCase()}/dashboard`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during login');
        res.redirect('/auth/login');
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
};