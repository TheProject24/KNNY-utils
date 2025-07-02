const mongoose = require('mongoose');

const LectureSchema = mongoose.Schema({
    title: {type: String, required: true },
    description: { type: String, required: true },
    files: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', LectureSchema) 