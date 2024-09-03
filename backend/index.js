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

// Routes
app.post('/api/generate-plantuml', async (req, res) => {
  const { script } = req.body;

  try {
    // Send the PlantUML script to the Kroki server
    const krokiUrl = 'https://kroki.io/plantuml/png';
    const response = await axios.post(krokiUrl, script, {
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'arraybuffer' // Ensure the image is treated as binary data
    });

    // Convert the binary data to a base64 encoded string
    const imageUrl = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;

    // Send the generated URL back to the frontend
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating PlantUML image with Kroki:", error);
    res.status(500).json({ error: 'Failed to generate PlantUML image.' });
  }
});

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/', router);

mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Database Connection Successful'))
  .catch(err => console.log(err));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
