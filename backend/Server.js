const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});