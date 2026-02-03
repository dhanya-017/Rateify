const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');
const {
  validateUserCreation,
  validateStoreCreation,
  handleValidationErrors,
} = require('../middleware/validation');

router.use(auth);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboard);

router.post('/users', validateUserCreation, handleValidationErrors, createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/stores', validateStoreCreation, handleValidationErrors, createStore);
router.get('/stores', getStores);

module.exports = router;
