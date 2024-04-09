const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas');

router.post('/registration', async (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    const newUser = new schemas.Users({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password
    });

    const savedUser = await newUser.save();
    if (savedUser){
        console.log(`${firstname} ${lastname} registered.`);
        res.status(201).send('Registered User Successfully');
    } else {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
    res.end()
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await schemas.Users.findOne({ username: username, password: password });
        res.send(user); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await schemas.Users.find();
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

module.exports = router;
