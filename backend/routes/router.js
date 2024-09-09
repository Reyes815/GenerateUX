const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas');

router.post('/registration', async (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    try {
        const newUser = new schemas.Users({
            firstName: firstname,
            lastName: lastname,
            username: username,
            password: password
        });

        const savedUser = await newUser.save();
        console.log(`${firstname} ${lastname} registered.`);
        res.status(201).send('Registered User Successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await schemas.Users.findOne({ username: username, password: password });
        if (user) {
            res.send({ id: user._id, ...user._doc }); 
        } else {
            res.status(404).send('User not found');
        }
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

router.post('/wireframe', async (req, res) => {
    const { user_id, htmlCode } = req.body; 
    try {
        const newWireframe = new schemas.Wireframe({
            user_id: user_id,
            htmlCode: htmlCode
        });

        const savedWireframe = await newWireframe.save();
        console.log(`Wireframe created for user with ID ${user_id}.`); 
        res.status(201).send('Wireframe created successfully');
    } catch (error) {
        console.error('Error creating wireframe:', error);
        res.status(500).send('Error creating wireframe');
    }
});

router.post('/save-diagram', async (req, res) => {
    const { userId, name, bpmn } = req.body;

    try {
        const newDiagram = new schemas.Activity_Diagram({
            user_id: userId,
            name: name,
            bpmn: bpmn
        });

        await newDiagram.save();
        res.status(201).send('Diagram saved successfully');
    } catch (error) {
        console.error('Error saving diagram:', error);
        res.status(500).send('Error saving diagram');
    }
});

router.get('/diagrams/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const diagrams = await schemas.Activity_Diagram.find({ user_id: user_id }, { name: 1, bpmn: 1,  _id: 0 }); 
        res.json(diagrams);
    } catch (error) {
        console.error('Error fetching diagrams:', error);
        res.status(500).send('Error fetching diagrams');
    }
});


module.exports = router;
