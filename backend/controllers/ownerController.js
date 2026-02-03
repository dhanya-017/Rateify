const pool = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const storeResult = await pool.query(
      'SELECT id, name FROM stores WHERE owner_id = $1',
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const store = storeResult.rows[0];

    const averageRatingResult = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );

    const ratingsCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM ratings WHERE store_id = $1',
      [store.id]
    );

    res.json({
      store: {
        id: store.id,
        name: store.name,
      },
      averageRating: parseFloat(averageRatingResult.rows[0].average_rating).toFixed(2),
      totalRatings: parseInt(ratingsCountResult.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { sort = 'created_at', order = 'desc' } = req.query;

    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const storeId = storeResult.rows[0].id;

    const validSortColumns = ['rating', 'created_at', 'user_name'];
    const sortColumn = sort === 'user_name' ? 'u.name' : 
                       validSortColumns.includes(sort) ? `r.${sort}` : 'r.created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(query, [storeId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getStoreRatings,
};
