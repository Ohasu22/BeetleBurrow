// backend/routes/marketingOptimizer.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

const WORQHAT_API_URL = 'https://api.worqhat.com/flows/trigger/aac9fc5d-4cb9-4b1e-b487-4b5be8f65d72';
const WORQHAT_API_KEY = 'wh_m9e28cu1voPanb9A0ZQJcVGm12oLyFoAO2rerZCgKz';


router.post('/marketingcampaign', async (req, res) => {
  try {
    const inputData = req.body;
    console.log(inputData);
    const response = await axios.post(
      WORQHAT_API_URL,
      { inputs : inputData },
      {
        headers: {
          Authorization: `Bearer ${WORQHAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = currentDate.toTimeString().split(' ')[0]; // HH:MM:SS

    const insertQuery = 'INSERT INTO history (service, date, time) VALUES (?, ?, ?)';
    db.query(insertQuery, ['Marketing Campaign Optimizer', date, time], (err, result) => {
      if (err) {
        console.error('Failed to insert history:', err);
      } else {
        console.log('History record added');
      }
    });
    console.log(response.data.data);
    res.json(response.data.data);
  } catch (err) {
    console.error('WorqHat API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get recommendations from WorqHat API' });
  }
});

module.exports = router;
