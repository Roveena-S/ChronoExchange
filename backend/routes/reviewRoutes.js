const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReview,
  getServiceReviews,
  getUserReviews,
} = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/service/:serviceId', getServiceReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;
