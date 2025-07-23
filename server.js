const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// Database configuration (put your actual credentials here)
const dbConfig = {
  host: 'localhost',
  user: 'onli_amitymba',      // Replace with your database username
  password: 'O0BDoHKiwkI01-tA',  // Replace with your database password
  database: 'onli_amity'
};

// Middleware
app.use(cors());
app.use(express.json());

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to database');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

// API Endpoint to submit enquiries
app.post('/api/enquiries', async (req, res) => {
  try {
    const { full_name, phone_number, email } = req.body;

    // Basic validation
    if (!full_name || !phone_number || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO enquiries (full_name, phone_number, email) VALUES (?, ?, ?)',
      [full_name, phone_number, email]
    );

    res.json({
      success: true,
      message: 'Enquiry submitted successfully'
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  testConnection();
});