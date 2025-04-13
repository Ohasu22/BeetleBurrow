const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require('../db');

const WORQHAT_WORKFLOW_URL = "https://api.worqhat.com/flows/trigger/cf0704ea-b1f9-4c6d-9198-33adc8a7cf6d ";
const WORQHAT_API_KEY = "wh_m9e28cu1voPanb9A0ZQJcVGm12oLyFoAO2rerZCgKz";

router.post("/manual", async (req, res) => {
  let customerData = req.body;

  try {
    customerData = {
      ...customerData,
      customer_id: parseInt(customerData.customer_id),
      total_monthly_spend: parseInt(customerData.total_monthly_spend),
      avg_monthly_spend: parseInt(customerData.avg_monthly_spend),
    };

    console.log("Sanitized data:", customerData);

    const response = await axios.post(
      WORQHAT_WORKFLOW_URL,
      { ...customerData },
      {
        headers: {
          Authorization: `Bearer ${WORQHAT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = currentDate.toTimeString().split(' ')[0]; // HH:MM:SS

        const insertQuery = 'INSERT INTO history (service, date, time) VALUES (?, ?, ?)';
         db.query(insertQuery, ['Loyalty Engagement Engine', date, time], (err, result) => {
           if (err) {
             console.error('Failed to insert history:', err);
                } else {
             console.log('History record added');
           }
        });
    }   
    res.json({
      success: true,
      customerData,
      worqhatResponse: response.data,
    });

    console.log("Manual Input Result:", response.data);
  } catch (error) {
    console.error("Manual Input Error:", error?.response?.data || error.message);
    res.status(500).json({ error: error?.response?.data || "WorqHat API Error" });
  }
});

module.exports = router;
