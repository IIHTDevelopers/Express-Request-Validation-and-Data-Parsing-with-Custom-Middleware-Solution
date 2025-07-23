// tests/app.test.js
const request = require('supertest');
const app = require('../app');  // Import the Express app

let appBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {
        // Test for valid JSON data submission
        it(`${appBoundaryTest} should process valid JSON data and return success`, async () => {
            const requestData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                phone: '1234567890'
            };

            const response = await request(app)
                .post('/submit')
                .send(requestData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User data validated and processed successfully');
            expect(response.body.data).toEqual(requestData);
        });

        // Test for valid form data submission
        it(`${appBoundaryTest} should process valid form data and return success`, async () => {
            const requestData = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                age: 25,
                phone: '0987654321'
            };

            const response = await request(app)
                .post('/submit')
                .type('form')
                .send(requestData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User data validated and processed successfully');
        });

        // Test for missing fields
        it(`${appBoundaryTest} should return an error if required fields are missing`, async () => {
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'john@example.com' });  // Missing age and phone

            expect(response.status).toBe(400);
            expect(response.body.code).toBe('ERR_MISSING_FIELDS');
            expect(response.body.error).toBe('Name, email, age, and phone are required');
        });

        // Test for invalid email format
        it(`${appBoundaryTest} should return an error if email format is invalid`, async () => {
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'johnexample.com', age: 30, phone: '1234567890' });  // Invalid email

            expect(response.status).toBe(400);
            expect(response.body.code).toBe('ERR_INVALID_EMAIL');
            expect(response.body.error).toBe('Invalid email format');
        });

        // Test for invalid age (out of range)
        it(`${appBoundaryTest} should return an error if age is not within the valid range`, async () => {
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'john@example.com', age: 17, phone: '1234567890' });  // Invalid age (under 18)

            expect(response.status).toBe(400);
            expect(response.body.code).toBe('ERR_INVALID_AGE');
            expect(response.body.error).toBe('Age must be a number between 18 and 120');
        });

        // Test for invalid phone number format
        it(`${appBoundaryTest} should return an error if phone number format is invalid`, async () => {
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'john@example.com', age: 30, phone: '12345' });  // Invalid phone number

            expect(response.status).toBe(400);
            expect(response.body.code).toBe('ERR_INVALID_PHONE');
            expect(response.body.error).toBe('Invalid phone number format (must be 10 digits)');
        });

        // Test for valid phone number format
        it(`${appBoundaryTest} should process valid data when phone number is valid`, async () => {
            const requestData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                phone: '1234567890'
            };

            const response = await request(app)
                .post('/submit')
                .send(requestData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User data validated and processed successfully');
            expect(response.body.data).toEqual(requestData);
        });

        // Test for invalid JSON format (unexpected data)
        it(`${appBoundaryTest} should return a 400 error for unexpected or invalid JSON format`, async () => {
            const response = await request(app)
                .post('/submit')
                .send({ name: 'John Doe', email: 'john@example.com', phone: '12345' }); // Missing age

            expect(response.status).toBe(400);
            expect(response.body.code).toBe('ERR_MISSING_FIELDS');
            expect(response.body.error).toBe('Name, email, age, and phone are required');
        });
    });
});
