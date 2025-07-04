const express = require('express');
const fs = require('fs');
const upload = require('../middleware/upload');
const Lecture = require('../models/Lecture');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const lectures = await Lecture.find().sort({ createdAt: -1 });
        return res.status(200).json(lectures);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Server error'});
    }    
})

router.post('/', upload.array('files', 10), async (req, res) => {

    try {
        const { title, description } = req.body;
        const file = req.files;
        const filePaths = file.map(file => file.path);
        
        if(!title || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newLecture = new Lecture({ title, description, files: filePaths });
        const savedLecture = await newLecture.save();

        return res.status(201).json(savedLecture);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    
    try {
        const deletedLecture = await Lecture.findByIdAndDelete(req.params.id);
        if (!deletedLecture) {
            return res.status(404).json({ error: 'Not Found' });
        }

        return res.status(200).json({ message: 'File deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
})

router.patch('/:id', async (req, res) => {

    try{
        const lectureID = req.params.id;
        const updates = req.body;

        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureID,
            updates,
            { new: true },
        );

        if (!updatedLecture) {
            return res.status(404).json({ error: 'Not found' });
        }

        return res.status(200).json(updatedLecture);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
    }
})

router.get('/:id/files', async (req, res) => {

    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({ error: 'Not Found' });
        }

        return res.status(200).json(lecture.files)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
})

router.delete('/:id/files', async (req, res) => {

    try {
        const lectureID = req.params.id;
        const { filepath } = req.body;
        const lecture = await Lecture.findById(lectureID);
        if (!lecture) {
            return res.status(404).json({ error: 'Lecture Error' });
        }

        const fileIndex = await lecture.files.indexOf(filepath);
        if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found in lecture'});
        }

        lecture.files.splice(fileIndex, 1);
        await lecture.save();

        fs.unlink(path.join(__dirname, '..', filepath), (err) => {
            if (err) {
                console.error('File delete error:', err);
            }
        })
        return res.status(200).json({ error: 'File successfuly deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
})

module.exports = router;