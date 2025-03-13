const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Endpoint for sum calculation
app.post('/calculate-sum', express.json(), (req, res) => {
    const { file, product } = req.body;

    // Validate input
    if (!file || !product) {
        return res.status(400).json({
            file: file || null,
            error: 'Invalid JSON input.'
        });
    }

    const filePath = path.join(__dirname, "B01006432_PV_dir", file);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            file: file,
            error: 'File not found.'
        });
    }

    let sum = 0;
    let isCSVValid = true;
    let columnCount = null;

    // Parse the CSV and calculate sum
    const fileStream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const currentColumnCount = Object.keys(row).length;

            // Set the expected column count based on the first row
            if (columnCount === null) {
                columnCount = currentColumnCount;
            } else if (currentColumnCount !== columnCount) {
                isCSVValid = false; // Inconsistent column count
            }

            // Perform sum calculation if the row matches the product
            if (row.product === product) {
                // Find the amount column - it might have a different case or name
                let amount;
                if (row.amount !== undefined) {
                    amount = row.amount;
                } else if (row.Amount !== undefined) {
                    amount = row.Amount; 
                } else if (row.AMOUNT !== undefined) {
                    amount = row.AMOUNT;
                } else {
                    // Look for any column that might contain numeric values
                    for (const key in row) {
                        if (!isNaN(parseFloat(row[key])) && key !== 'product') {
                            amount = row[key];
                            break;
                        }
                    }
                }
                
                // Now parse the amount and check it's valid
                const amountValue = parseFloat(amount);
                if (!isNaN(amountValue)) {
                    sum += amountValue;
                }
            }
        })
        .on('error', (error) => {
            isCSVValid = false;
            fileStream.destroy(); // Stop processing if an error occurs
            return res.status(400).json({ error: "Invalid CSV file. Parsing failed." });
        })
        .on('end', () => {
            if (isCSVValid && columnCount > 1) {
                // If the CSV file is valid, return the sum
                res.json({ file: file, sum: sum });
            } else {
                // Invalid CSV file
                return res.status(400).json({
                    file: file,
                    error: "Input file not in CSV format."
                });
            }
        });
});

app.get('/', (req, res) => {
    res.send('Welcome to the CSV Sum Service!');
});

app.listen(PORT, () => {
    console.log(`CSV Sum Service listening on port ${PORT}`);
});
