const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const privateRoutes = require('./routes/private');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/private', privateRoutes); 

module.exports = app;
