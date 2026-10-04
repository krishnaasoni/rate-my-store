const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
} = require('../controllers/adminController');
const {
  createUserValidationRules,
  createStoreValidationRules,
} = require('../validators/adminValidator');
const validate = require('../middlewares/validate');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication and ADMIN role guards to all routes in this router
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

// Dashboard Stats
router.get('/dashboard', getDashboardStats);

// Users Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUserValidationRules, validate, createUser);

// Stores Management
router.get('/stores', getStores);
router.post('/stores', createStoreValidationRules, validate, createStore);

module.exports = router;
