const mongoose = require('mongoose');

const LectureSchema = mongoose.Schema({
    course: {type: String, required: true }
})
