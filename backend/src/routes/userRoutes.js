const express = require('express');
const { getStores, submitRating, updateRating } = require('../controllers/userController');
const {
  ratingValidationRules,
  updateRatingValidationRules,
} = require('../validators/userOwnerValidator');
const validate = require('../middlewares/validate');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get store list (accessible by logged-in users)
router.get('/stores', authenticateToken, getStores);

// Ratings endpoints (USER role only)
router.post(
  '/ratings',
  authenticateToken,
  authorizeRoles('USER'),
  ratingValidationRules,
  validate,
  submitRating
);

router.put(
  '/ratings/:id',
  authenticateToken,
  authorizeRoles('USER'),
  updateRatingValidationRules,
  validate,
  updateRating
);

module.exports = router;
