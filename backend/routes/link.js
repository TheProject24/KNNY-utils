const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const {handleServerError, handleNotFound} = require('../middleware/responseHelpers');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        // Build filter for query parameters
        let filter = {};
        if (req.query.title) {
            filter.title = new RegExp(req.query.title, 'i');
        }
        if (req.query.tag) {
            filter.tag = new RegExp(req.query.tag, 'i');
        }

        // Fetch links with filter
        const links = await Link.find(filter);

        // Check if links exist
        if (!links || links.length === 0) {
            return res.status(404).json({ error: 'No links found' });
        }

        // Return links
        return res.status(200).json(links);
    } catch (err) {
        console.error('Error fetching links:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {

    try {
        const { title, url, tag } = req.body;

        if (!title || !url ) {
            return res.status(400).json({ error: 'title and url fields are required' });
        }
        const newLink = new Link({ title, url, tag });
        const savedLink = await newLink.save()

        return res.status(201).json(savedLink);
    } catch (err) {
        handleServerError(res, err);
    }
})

router.get('/:id', async (req, res) => {

    try {
        const link = await Link.findById(req.params.id);

        if (handleNotFound(link, res));

        return res.status(200).json(link);
    } catch (err) {
        handleServerError(res, err);
    }
})

router.delete('/:id', async (req, res) => {

    try {
        const deletedLink = await Link.findByIdAndDelete(req.params.id);

        if (handleNotFound(deletedLink, res));

        return res.status(200).json({ error: 'File deleted' });
    } catch (err) {
        handleServerError(res, err);
    }
})

router.patch('/:id', async (req, res) => {

    try{
        const id = req.params.id;
        const updates = req.body;

        const updatedLink = await Link.findByIdAndUpdate(
            id,
            updates,
            { new:  true }
        )

        if (handleNotFound(updatedLink, res));

        return res.status(200).json(updatedLink);
    } catch (err) {
        handleServerError(res, err);
    }
})

router.get('/tag/:tag', async (req, res) => {

    try{
        const links = await Link.find({ tag: req.params.tag })

        if (handleNotFound(links, res));

        return res.status(200).json(links)
    } catch (err) {
        handleServerError(res, err);
    }
})
module.exports = router