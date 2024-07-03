const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { sequelize } = require('./models');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001', // Your frontend application
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware globally
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

sequelize.sync()
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
