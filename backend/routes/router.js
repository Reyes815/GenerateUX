const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    const userData = [
        {
            "id": 1,
            "username": "test1",
            "password": "123"
        }
    ];

    res.send(userData);
});

module.exports = router;
