const express = require('express');
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
