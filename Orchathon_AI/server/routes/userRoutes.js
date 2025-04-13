const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {

      db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email]);
    } else {

      db.query('INSERT INTO users (email, otp) VALUES (?, ?)', [email, otp]);
    }
    const OTP = String(otp);
    const user_email=email;
    console.log(OTP,user_email);
    const WORQHAT_API_KEY = "wh_m9e28cu1voPanb9A0ZQJcVGm12oLyFoAO2rerZCgKz";
    try {

      await axios.post(
        'https://api.worqhat.com/flows/trigger/2e237854-f30e-4e0c-9321-31aedd241e86',
        {
          OTP, 
          user_email 
        },
        {
          headers: {
            Authorization: `Bearer ${WORQHAT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (emailErr) {
      console.error('WorqHat email error:', emailErr.message);
      res.status(500).json({ success: false, message: 'Failed to send email using WorqHat' });
    }
  });
});


router.post('/login', (req, res) => {
  const { email, otp } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  });
});

module.exports = router;
