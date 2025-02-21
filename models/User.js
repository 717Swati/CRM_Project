// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Reviewer', 'Author'],
        default: 'Author',
    },
    date: { type: Date, default: Date.now },
});

// Password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed in pre-save hook for user:', this.email);
        next();
    } catch (err) {
        next(err);
    }
});



module.exports = mongoose.model('User', userSchema);