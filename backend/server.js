const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Database connected successfully',
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/apply', async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Full name and email are required.'
      });
    }

    const defaultPasswordHash =
      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    const userResult = await pool.query(
      `
      INSERT INTO users (
        full_name,
        email,
        role_id,
        password_hash,
        phone,
        is_active,
        failed_login_attempts
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone
      RETURNING user_id
      `,
      [full_name, email, 1, defaultPasswordHash, phone || null, true, 0]
    );

    const userId = userResult.rows[0].user_id;

    await pool.query(
      `
      INSERT INTO applications (user_id, status, bio)
      VALUES ($1, $2, $3)
      `,
      [
        userId,
        'submitted',
        message || 'No bio provided'
      ]
    );

    res.json({
      success: true,
      message: 'Application submitted successfully.'
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application.',
      error: error.message
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const result = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.password_hash, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.role_name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.'
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.role_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});