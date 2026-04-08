const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin } = require('./middleware/auth');
const { validateApply, validateLogin, validateContact } = require('./middleware/validation');
const { logger, logEvent } = require('./middleware/logger');
const multer = require('multer');
require('dotenv').config();

const pool = require('./db');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Backend running');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
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
    logEvent({
      event: "DB_CONNECTION_FAILED",
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/apply', (req, res, next) => {
  
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, validateApply, async (req, res) => {
  try {
    const { full_name, email, phone, message } = req.body;
    const file = req.file;
    console.log("Uploaded file:", file);

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
      [userId, 'submitted', message || 'No bio provided']
    );

    logEvent({
      event: "APPLICATION_SUBMITTED",
      email,
      user_id: userId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Application submitted successfully.'
    });

  } catch (error) {
    console.error('Apply error:', error);

    logEvent({
      event: "APPLICATION_FAILED",
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to submit application.'
    });
  }
});

app.post('/api/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, u.password_hash, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      logEvent({
        event: "LOGIN_FAILED",
        email,
        reason: "User not found",
        ip: req.ip
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatch) {
      logEvent({
        event: "LOGIN_FAILED",
        email,
        reason: "Wrong password",
        ip: req.ip
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.role_name !== 'admin') {
      logEvent({
        event: "UNAUTHORIZED_ADMIN_ACCESS",
        email,
        ip: req.ip
      });

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

    logEvent({
      event: "LOGIN_SUCCESS",
      email: user.email,
      user_id: user.user_id,
      ip: req.ip
    });

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

    logEvent({
      event: "LOGIN_ERROR",
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Login failed.'
    });
  }
});

app.post('/api/contact', validateContact, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    logEvent({
      event: "CONTACT_SUBMITTED",
      name,
      email,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact error:', error);

    logEvent({
      event: "CONTACT_FAILED",
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

app.get('/api/admin', authenticateToken, requireAdmin, (req, res) => {
  logEvent({
    event: "ADMIN_ACCESS",
    user: req.user?.email,
    ip: req.ip
  });

  res.json({ message: 'Admin access granted' });
});

app.get('/test-token', (req, res) => {
  const token = jwt.sign(
    { user_id: 1, email: 'test@test.com', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

app.get('/api/search', async (req, res) => {
  try {
    const { full_name, email } = req.query;

    let query = `
      SELECT a.application_id, a.user_id, u.full_name, u.email, u.phone, a.bio, a.created_at
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (full_name) {
      query += ` AND u.full_name ILIKE $${paramIndex++}`;
      params.push(`%${full_name}%`);
    }

    if (email) {
      query += ` AND u.email ILIKE $${paramIndex++}`;
      params.push(`%${email}%`);
    }

    query += ` ORDER BY a.created_at DESC LIMIT 50`;

    const result = await pool.query(query, params);

    res.json({ success: true, results: result.rows });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Failed to perform search.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});