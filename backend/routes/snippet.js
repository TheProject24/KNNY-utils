const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');
const { handleNotFound, handleServerError } = require('../middleware/responseHelpers');


router.get('/', async (req, res) => {

    try {
        let filter = {};
        if (req.query.title) filter.title = new RegExp(req.query.title, 'i');
        if (req.query.language) filter.language = new RegExp(req.query.language, 'i');
        
        const snippets = await Snippet.find(filter);

        handleNotFound(snippets, res);

        return res.status(200).json(snippets);

    } catch (err) {
        handleServerError(res, err);
    }
});

router.post('/', async (req, res) => {

    try {
        const { title, code, language, tags, description } = req.body;
        
        if (!title || !code || !language ){
            return res.status(400).json({ error: 'Title, Code and Language fields are required' });
        }

        const newSnippet = await new Snippet({ title, code, language, tags, description });
        const savedSnippet = newSnippet.save();

        return res.status(201).json(savedSnippet);
    } catch (err) {
        handleServerError(res, err);
    }
})

router.get('/:id', async(req, res) => {

    try {
        const snippet = await Snippet.findById(req.params.id);
        
        handleNotFound(snippet, res);

        return res.status(200).json(snippet);
    } catch (err) {
        handleServerError(res,err);
    }
})

module.exports = router