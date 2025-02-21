// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.ensureAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error_msg', 'Please log in to access this resource');
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/auth/login');
        }

        res.locals.user = req.user;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.clearCookie('token');
        req.flash('error_msg', 'Session expired, please log in again');
        res.redirect('/auth/login');
    }
};


exports.forwardAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }
    res.redirect('/dashboard');
};

// Role-based Access Control
// middleware/auth.js

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            req.flash('error_msg', 'Please log in to access this resource');
            return res.redirect('/auth/login');
        }

        if (!roles.includes(req.user.role)) {
            req.flash('error_msg', 'You are not authorized to view this resource');
            return res.redirect('/dashboard');
        }

        next();
    };
};