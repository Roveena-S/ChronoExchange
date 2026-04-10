const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getDashboardStats,
  uploadProfilePhoto,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile-photo', protect, upload.single('profilePhoto'), uploadProfilePhoto);
router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, admin, getAllUsers);

module.exports = router;
