require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions)); // Use CORS middleware globally
app.use(express.json()); // Parse JSON request bodies
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
