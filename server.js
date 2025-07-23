const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
  host: 'localhost',              // or your DB host IP if remote
  user: 'onli_amitymba',          // DB user
  password: 'O0BDoHKiwkI01-tA',   // DB password
  database: 'onli_amity'          // DB name
};

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Test DB connection at startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit the app if DB connection fails
  }
}

// API route to handle enquiries
app.post('/api/enquiries', async (req, res) => {
  const { full_name, phone_number, email } = req.body;

  // Input validation
  if (!full_name || !phone_number || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO enquiries (full_name, phone_number, email) VALUES (?, ?, ?)',
      [full_name, phone_number, email]
    );

    res.json({
      success: true,
      message: 'Enquiry submitted successfully'
    });
  } catch (err) {
    console.error('❌ Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  testConnection(); // Check DB connection
});
