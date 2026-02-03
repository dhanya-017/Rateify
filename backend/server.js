require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const ownerRoutes = require('./routes/owner');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log(`Server running on port ${PORT}`);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
