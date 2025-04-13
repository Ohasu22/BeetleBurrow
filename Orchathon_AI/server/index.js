const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const adCampaign = require('./routes/adCampaign');
const app = express();
const loyaltyRoutes =require('./routes/loyalty');
const marketing = require('./routes/marketingOptimizer');
const history = require('./routes/history');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser.json());


app.use('/api', userRoutes);

app.use('/api/ad-campaign', adCampaign);


app.use('/api/history', history);

app.use("/api", loyaltyRoutes);


app.use('/api', marketing);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);
