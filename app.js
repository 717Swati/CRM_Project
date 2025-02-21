// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser'); // Added for cookie parsing
const helmet = require('helmet'); // Added for security enhancements
const jwt = require('jsonwebtoken'); // Added for JWT handling
const User = require('./models/User'); // Added to access the User model for authentication
const app = express();

// Database connection
// app.js
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Middleware setup
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
app.use(express.json()); // For parsing JSON data
app.use(express.static('public')); // To serve static files from the 'public' directory
app.use(methodOverride('_method')); // To support PUT and DELETE methods in forms
app.use(cookieParser()); // To parse cookies from HTTP requests
app.use(helmet()); // To set secure HTTP headers for security

// Session and flash messages
app.use(
    session({
        secret: 'YourSecretKey', // Replace with a strong secret in production
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

// Middleware to set 'user' in res.locals if token is present
app.use(async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            res.locals.user = req.user;
        } catch (err) {
            res.clearCookie('token');
            req.flash('error_msg', 'Session expired, please log in again');
            return res.redirect('/auth/login');
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Global variables for flash messages
// Make sure to have this middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    next();
});


// View engine setup
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/reviewer', require('./routes/reviewer'));
app.use('/author', require('./routes/author'));
app.use('/test', require('./routes/test'));


// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));