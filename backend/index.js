const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const mongoose = require('mongoose');
require('dotenv/config');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use('/', router); 

app.post('/api/generate-plantuml', async (req, res) => {
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

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Database Connection Successful'))
    .catch(err => console.log(err));

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
