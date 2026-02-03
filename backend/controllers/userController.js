const pool = require('../config/database');

const getStores = async (req, res) => {
  try {
    const { search, sort = 'name', order = 'asc' } = req.query;
    let query = `
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (search) {
      query += ` AND (s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const validSortColumns = ['name', 'address', 'average_rating'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    query += ` GROUP BY s.id, s.name, s.address ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    if (existingRating.rows.length > 0) {
      await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3',
        [rating, userId, storeId]
      );
      res.json({ message: 'Rating updated successfully' });
    } else {
      await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
        [userId, storeId, rating]
      );
      res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
      [rating, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating updated successfully', rating: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStores,
  submitRating,
  updateRating,
};
