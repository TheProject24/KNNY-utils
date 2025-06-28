const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    course: { type: String, required: true },
    instruction: { type: String, required: true },
    givenDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: Date.now, required: true },
    submitted: { type: Boolean, default: false}
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);