const User = require('../models/User');
const Service = require('../models/Service');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, skillsOffered, skillsNeeded } = req.body;
    
    const updateData = { name, bio, skillsOffered, skillsNeeded };
    
    // Add profile photo if uploaded
    if (req.file) {
      updateData.profilePhoto = `/uploads/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePhoto = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto },
      { new: true }
    ).select('-password');

    res.json({ profilePhoto, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's current credits
    const user = await User.findById(userId);
    
    // Get active services count
    const activeServices = await Service.countDocuments({ 
      providerId: userId, 
      status: 'active' 
    });
    
    // Get completed exchanges count
    const completedExchanges = await Request.countDocuments({
      $or: [{ requesterId: userId }, { providerId: userId }],
      status: 'completed'
    });
    
    // Get average rating
    const userReviews = await Review.find({ revieweeId: userId });
    const averageRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
      : 0;
    
    // Get recent activity (transactions)
    const recentTransactions = await Transaction.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    })
    .populate('serviceId', 'title')
    .sort({ createdAt: -1 })
    .limit(5);
    
    const recentActivity = recentTransactions.map(transaction => ({
      action: transaction.transactionType === 'earned' ? 'Received' : 'Paid',
      service: transaction.serviceId?.title || 'Unknown Service',
      credits: transaction.credits,
      creditChange: transaction.transactionType === 'earned' 
        ? `+${transaction.credits}` 
        : `-${transaction.credits}`,
      isEarned: transaction.transactionType === 'earned',
      time: new Date(transaction.createdAt).toLocaleDateString()
    }));

    res.json({
      totalCredits: user.totalCredits,
      activeServices,
      completedExchanges,
      averageRating: averageRating.toFixed(1),
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
