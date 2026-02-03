const express = require('express');
const router = express.Router();
const {
  getStores,
  submitRating,
  updateRating,
} = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const {
  validateRating,
  handleValidationErrors,
} = require('../middleware/validation');

router.use(auth);
router.use(authorize('USER'));

router.get('/stores', getStores);
router.post('/ratings', validateRating, handleValidationErrors, submitRating);
router.put('/ratings/:id', validateRating, handleValidationErrors, updateRating);

module.exports = router;
