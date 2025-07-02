const { request } = require('express');
const mongoose = require('mongoose');

const SnippetSchema = mongoose.Schema({
    title: { required: true, type: String, default: 'Code Snippet' },
    language: { type: String, required: true, default: 'Code Language' },
    code: { type: String, required: true, default: 'Code Content' },
    tags: { type: String, default: 'Random' },
    description: { type: String, default: 'No Description'}
})

module.exports = mongoose.model('Snippet', SnippetSchema);