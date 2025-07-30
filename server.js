const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'onli_amitymba',
  password: 'O0BDoHKiwkI01-tA',
  database: 'onli_amity'
};

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'ashish.g14@gmail.com',
    pass: 'dulgxaskwfywdjvq' // App password
  }
};

const transporter = nodemailer.createTransport(emailConfig);

app.use(cors());
app.use(express.json());

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(' Successfully connected to database');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}


app.post('/api/enquiries', async (req, res) => {
  const { full_name, phone_number, email, course, admission_timeline } = req.body;

  if (!full_name || !phone_number || !email || !course || !admission_timeline) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    
    const [result] = await pool.query(
      `INSERT INTO enquiries (full_name, phone_number, email, course, admission_timeline)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, phone_number, email, course, admission_timeline]
    );

    
    const mailOptions = {
      from: 'ashish.g14@gmail.com',
      to: 'ashish.g14@gmail.com', 
      subject: `New Enquiry Received - ${full_name}`,
      html: `
        <h2>New Enquiry Details:</h2>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Phone:</strong> ${phone_number}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Admission Timeline:</strong> ${admission_timeline}</p>
        <p>This enquiry was submitted at ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.json({
      success: true,
      message: 'Enquiry submitted successfully'
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
  testConnection();
});