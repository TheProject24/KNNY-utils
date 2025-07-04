const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    role: { type: String, default: 'Student', enum: ['student', 'instructor']}
});

module.exports = mongoose.model('User', UserSchema);