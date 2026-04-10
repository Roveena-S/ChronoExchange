const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
} = require('../controllers/requestController');

router.post('/', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/complete', protect, completeRequest);
router.put('/:id/cancel', protect, cancelRequest);

module.exports = router;
