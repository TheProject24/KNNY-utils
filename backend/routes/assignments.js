const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

router.get('/', async (req, res) => {

    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
})

router.post('/', async (req, res) => {

    try {
        const { course, instruction, dueDate } = req.body;

        if (!course || !instruction || !dueDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newAssignment = new Assignment({ course, instruction, dueDate });
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.patch('/:id/', async (req, res) => {

    try {
        const assgID = req.params.id;
        const updates = req.body;

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assgID,
            updates,
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ error: 'Assignment not found ' });
        }

        return res.status(200).json(updatedAssignment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:id/submit', async (req, res) => {

    try {
        const assgID = req.params.id;

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assgID,
            { submitted: true },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        return res.status(200).json(updatedAssignment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
})

router.delete('/:id', async (req, res) => {

    try {
        const assgID = req.params.id;
        const deletedAssignment = await Assignment.findByIdAndDelete(assgID);

        if (!deletedAssignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        return res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
})

router.get('/:id', async (req, res) => {

    try {
        const assgID =req.params.id;
        const assignment = await Assignment.findById(assgID);

        if (!assignment){
            return res.status(404).json({ error: 'Assignment not found' });
        }

        return res.status(200).json(assignment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
})

module.exports = router