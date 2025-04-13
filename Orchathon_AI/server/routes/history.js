const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = 'SELECT * FROM history ORDER BY id ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching history:', err);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    res.json(results);
  });
});

module.exports = router;
