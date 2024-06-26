require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json()); // Parse JSON request bodies
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
