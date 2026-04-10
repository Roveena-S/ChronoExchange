const Review = require('../models/Review');
const User = require('../models/User');
const Request = require('../models/Request');

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, serviceId, requestId, rating, comment } = req.body;

    // Check if request exists and is completed
    const request = await Request.findById(requestId);
    if (!request || request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed requests' });
    }

    // ONLY requester can rate provider (not both ways)
    if (request.requesterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the requester can rate the provider' });
    }

    // Ensure reviewee is actually the provider
    if (request.providerId.toString() !== revieweeId) {
      return res.status(400).json({ message: 'Invalid review target' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      requestId,
      reviewerId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this request' });
    }

    const review = new Review({
      reviewerId: req.user.id,
      revieweeId,
      serviceId,
      requestId,
      rating,
      comment,
    });

    await review.save();

    // Update user average rating
    const reviews = await Review.find({ revieweeId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(revieweeId, { rating: avgRating });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate('reviewerId', 'name')
      .populate('revieweeId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
