const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getStoreRatings,
} = require('../controllers/ownerController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('OWNER'));

router.get('/dashboard', getDashboard);
router.get('/ratings', getStoreRatings);

module.exports = router;
