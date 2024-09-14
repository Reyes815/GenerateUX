const express = require('express');
const axios = require('axios');
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
        // Try to find and update an existing diagram
        const updatedDiagram = await schemas.Activity_Diagram.findOneAndUpdate(
            { user_id: userId, name: name },  // Query to find by userId and name
            { $set: { bpmn: bpmn } },         // Only update the BPMN field
            { new: true }                     // Return the updated document
        );

        if (updatedDiagram) {
            res.status(200).send('Diagram updated successfully');
        } else {
            // If no diagram was found, create a new one
            const newDiagram = new schemas.Activity_Diagram({
                user_id: userId,
                name: name,
                bpmn: bpmn
            });

            await newDiagram.save();
            res.status(201).send('New diagram saved successfully');
        }
    } catch (error) {
        console.error('Error saving/updating diagram:', error);
        res.status(500).send('Error saving/updating diagram');
    }
});


router.post('/api/generate-plantuml', async (req, res) => {
    const { script } = req.body;

    try {
        const krokiUrl = 'https://kroki.io/plantuml/png';
        const response = await axios.post(krokiUrl, script, {
            headers: {
                'Content-Type': 'text/plain'
            },
            responseType: 'arraybuffer'
        });

        const imageUrl = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error("Error generating PlantUML image with Kroki:", error);
        res.status(500).json({ error: 'Failed to generate PlantUML image.' });
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
