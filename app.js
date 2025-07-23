// app.js
const express = require('express');
const app = express();

// Middleware: Parse incoming requests (JSON and form data)
app.use(express.json());  // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse form-urlencoded data

// Middleware 1: Request Validation Middleware
function validateRequest(req, res, next) {
    const { name, email, age, phone } = req.body;

    // Check for missing fields
    if (!name || !email || !age || !phone) {
        return res.status(400).json({ code: 'ERR_MISSING_FIELDS', error: 'Name, email, age, and phone are required' });
    }

    // Validate email format using a regex
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ code: 'ERR_INVALID_EMAIL', error: 'Invalid email format' });
    }

    // Validate age (should be a number between 18 and 120)
    if (isNaN(age) || age < 18 || age > 120) {
        return res.status(400).json({ code: 'ERR_INVALID_AGE', error: 'Age must be a number between 18 and 120' });
    }

    // Validate phone number format (basic regex for phone numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ code: 'ERR_INVALID_PHONE', error: 'Invalid phone number format (must be 10 digits)' });
    }

    next();  // If all validations pass, proceed to the next middleware or route handler
}

// Middleware 2: Process the validated request data
function processRequest(req, res, next) {
    const { name, email, age, phone } = req.body;
    req.processedData = { name, email, age, phone };  // Attach validated data to the request object
    next();  // Pass control to the next middleware or route handler
}

// Route for POST request: Submit user data
app.post('/submit', validateRequest, processRequest, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'User data validated and processed successfully',
        data: req.processedData
    });
});

// Global error handling middleware (for unexpected errors)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ code: 'ERR_INTERNAL', error: 'Internal server error' });
});

module.exports = app;
