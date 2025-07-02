const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    tag: { type:  String, default: 'Generic' }
})

module.exports = mongoose.model('Link', LinkSchema)