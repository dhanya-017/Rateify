const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const storesCount = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');
    const averageRating = await pool.query('SELECT AVG(rating) as avg_rating FROM ratings');

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStores: parseInt(storesCount.rows[0].count),
      totalRatings: parseInt(ratingsCount.rows[0].count),
      averageRating: parseFloat(averageRating.rows[0].avg_rating) || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, role, sort = 'name', order = 'asc' } = req.query;
    let query = `
      SELECT id, name, email, address, role 
      FROM users 
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    const validSortColumns = ['name', 'email', 'role'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role,
              CASE 
                WHEN u.role = 'OWNER' THEN (
                  SELECT COALESCE(AVG(r.rating), 0)
                  FROM ratings r
                  JOIN stores s ON r.store_id = s.id
                  WHERE s.owner_id = u.id
                )
                ELSE 0
              END as average_rating
       FROM users u 
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const existingStore = await pool.query(
      'SELECT id FROM stores WHERE email = $1',
      [email]
    );

    if (existingStore.rows.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const { search, sort = 'name', order = 'asc' } = req.query;
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (s.name ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const validSortColumns = ['name', 'email', 'address', 'average_rating'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    query += ` GROUP BY s.id, s.name, s.email, s.address, u.name ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
