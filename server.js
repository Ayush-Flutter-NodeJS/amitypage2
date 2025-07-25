const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'onli_amitymba',
  password: 'O0BDoHKiwkI01-tA',
  database: 'onli_amity'
};

app.use(cors());
app.use(express.json());

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

// Updated API endpoint
app.post('/api/enquiries', async (req, res) => {
  const { full_name, phone_number, email, course, admission_timeline } = req.body;

  // Validate required fields
  if (!full_name || !phone_number || !email || !course || !admission_timeline) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO enquiries (full_name, phone_number, email, course, admission_timeline)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, phone_number, email, course, admission_timeline]
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

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  testConnection();
});
