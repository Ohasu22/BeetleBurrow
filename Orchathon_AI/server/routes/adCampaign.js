const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const db = require('../db');


router.post('/', async (req, res) => {
  const { recipientCompany, targetApp, productName, additionalPrompt, offer, orientation } = req.body;

  try {
    
    const apiKey='wh_m9e28cu1voPanb9A0ZQJcVGm12oLyFoAO2rerZCgKz';
    const recipient_company=recipientCompany;
    const target_app=targetApp;
    const product_name=productName;
    const additional_prompt=additionalPrompt;
    const response = await axios.post('https://api.worqhat.com/flows/trigger/39bb22cd-7f2d-4815-b225-06e640f7b0b5', 
    {
            recipient_company,
            target_app,
            product_name,
            additional_prompt,
            offer,
            orientation
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    console.log(response);
    const imageUrl = response.data.data.image;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = currentDate.toTimeString().split(' ')[0]; // HH:MM:SS

    const insertQuery = 'INSERT INTO history (service, date, time) VALUES (?, ?, ?)';
    db.query(insertQuery, ['Social Media Campaigns', date, time], (err, result) => {
      if (err) {
        console.error('Failed to insert history:', err);
      } else {
        console.log('History record added');
      }
    });

    res.json({ imageUrl });
    // res.json({ imageUrl: response.data.data.image });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;
