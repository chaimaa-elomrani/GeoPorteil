const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the test route!' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
