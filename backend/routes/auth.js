const express = require('express');
const router = express.Router();
const jwt = require('jwt');
const {handleServerError, handleNotFound, handleBadUserRequest } = require('../middleware/responseHelpers');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password){
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = bcrypt.hash(password);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        return res.status(201).json(savedUser);
    } catch (err) {
        handleServerError(err, res);
    }
})

router.post('/login', async (req, res) => {

    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userFound = await User.findOne({ email });
        handleBadUserRequest(userFound, res);

        const isPasswordValid = bcrypt.compareSync(password, userFound.password);
        handleBadUserRequest(isPasswordValid, res)

        const token = jwt.sign(
            { id: userFound._id, role: userFound.role},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

    } catch (err) {
        handleServerError(err, res);
    }
})

module.exports = router;