const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { handleServerError, handleNotFound, handleBadUserRequest } = require('../middleware/responseHelpers');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userExists = await User.findOne({ username })
        if (userExists) {
            return res.status(400).json({ error: 'Username Already Exists'})
        }
        const emailExists = await User.findOne({ username })
        if (emailExists) {
            return res.status(400).json({ error: 'Email Already Exists' });
        }

        const normalizedRole = req.body.role ? req.body.role.toLowerCase() : 'student';
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: normalizedRole
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        handleServerError(err, res);
    }
});

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = bcrypt.compareSync(password, userFound.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign(
            { id: userFound._id, role: userFound.role, username: userFound.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });

    } catch (err) {
        handleServerError(err, res);
    }
});

module.exports = router;