const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getMyTransactions,
  getAllTransactions,
} = require('../controllers/transactionController');

router.get('/my-transactions', protect, getMyTransactions);
router.get('/', protect, admin, getAllTransactions);

module.exports = router;
