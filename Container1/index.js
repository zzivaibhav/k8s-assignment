const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware to parse incoming JSON
app.use(express.json());

app.post("/store-file", (req, res) => {
    const { file, data } = req.body;
    
    // Validate input
    if (!file) {
        return res.status(400).json({
           file: null,
              error: "Invalid JSON input."
        });
    }
    
    // Make sure the files directory exists
    const filesDir = path.join(__dirname, "files");
    if (!fs.existsSync(filesDir)) {
        fs.mkdirSync(filesDir, { recursive: true });
    }
    
    // Create file path and write the file
    const filePath = path.join(filesDir, file);
    
    try {
        fs.writeFileSync(filePath, data);
        res.status(201).json({
            file: file,
            message: "Success."
        });
    } catch (error) {
        res.status(500).json({
            file: file,
            error: "Error while storing the file to the storage."
        });
    }
});

// Endpoint to receive input and forward it to the second container
app.post('/calculate', (req, res) => {
    const { file, product } = req.body;

    // Check for invalid input
    if (!file || !product || file.trim() === '' || product.trim() === '') {
        return res.status(400).json({
            file: null,
            error: 'Invalid JSON input.'
        });
    }

    const filePath = path.join(__dirname, "files", file);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            file: file,
            error: 'File not found.'
        });
    }

    // Forward the request to the second container
    axios.post('http://container2-service:30006/calculate-sum', { file, product })
    // axios.post('http://localhost:3001/calculate-sum', { file, product })

        .then(response => res.json(response.data))
        .catch(error => {
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({ error: 'api call fails' });
            }
        });
});
app.get('/', (req, res) => {
    res.send('Welcome to the first container!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`App container listening on port ${PORT}`);
});
