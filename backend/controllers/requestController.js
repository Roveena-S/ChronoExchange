const Request = require('../models/Request');
const Service = require('../models/Service');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

exports.createRequest = async (req, res) => {
  try {
    const { serviceId } = req.body;

    // 1. Ensure service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // 2. Check if user is requesting their own service
    // Using .equals() for proper MongoDB ObjectId comparison
    if (service.providerId.equals(req.user.id)) {
      return res.status(400).json({ message: 'You cannot request your own service.' });
    }

    // 3. Prevent duplicate requests for the same service
    const existingRequest = await Request.findOne({
      serviceId,
      requesterId: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have an active request for this service.' });
    }

    // 4. Check if user has sufficient credits (if applicable)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.totalCredits < service.creditsRequired) {
      return res.status(400).json({ message: 'Insufficient credits to request this service.' });
    }

    // 5. Create the request
    const request = new Request({
      serviceId,
      requesterId: req.user.id,
      providerId: service.providerId,
    });

    await request.save();

    // Create notification
    await Notification.create({
      userId: service.providerId,
      message: `New service request for ${service.title}`,
      type: 'request',
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    // Get requests where user is either requester or provider
    const requests = await Request.find({
      $or: [{ requesterId: req.user.id }, { providerId: req.user.id }]
    })
      .populate('serviceId')
      .populate('requesterId', 'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('serviceId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only service provider can accept
    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only service provider can accept requests' });
    }

    // Can only accept pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only accept pending requests' });
    }

    request.status = 'accepted';
    await request.save();

    // Create notification
    await Notification.create({
      userId: request.requesterId,
      message: `Your request for ${request.serviceId.title} has been accepted`,
      type: 'accepted',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('serviceId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only service provider can reject
    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only service provider can reject requests' });
    }

    // Can only reject pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only reject pending requests' });
    }

    request.status = 'cancelled';
    await request.save();

    // Create notification
    await Notification.create({
      userId: request.requesterId,
      message: `Your request for ${request.serviceId.title} has been rejected`,
      type: 'rejected',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('serviceId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only service provider can mark as completed
    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only service provider can mark requests as completed' });
    }

    // Can only complete accepted requests
    if (request.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted requests' });
    }

    // Prevent completing twice
    if (request.status === 'completed') {
      return res.status(400).json({ message: 'Request already completed' });
    }

    // Check if requester still has sufficient credits
    const requester = await User.findById(request.requesterId);
    if (!requester) {
      return res.status(404).json({ message: 'Requester not found' });
    }

    const service = request.serviceId;
    if (requester.totalCredits < service.creditsRequired) {
      return res.status(400).json({ message: 'Requester no longer has sufficient credits' });
    }

    request.status = 'completed';
    request.completionDate = new Date();

    // Create transaction (credit transfer happens ONLY NOW)
    await Transaction.create({
      fromUserId: request.requesterId,
      toUserId: request.providerId,
      credits: service.creditsRequired,
      serviceId: service._id,
      requestId: request._id,
      transactionType: 'earned',
    });

    // Update user credits and stats - ONLY ON COMPLETION
    await User.findByIdAndUpdate(request.providerId, {
      $inc: {
        totalCredits: service.creditsRequired,
        creditsEarned: service.creditsRequired,
        completedExchanges: 1
      }
    });

    await User.findByIdAndUpdate(request.requesterId, {
      $inc: {
        totalCredits: -service.creditsRequired,
        creditsSpent: service.creditsRequired,
        completedExchanges: 1
      }
    });

    await request.save();

    // Create notifications
    await Notification.create({
      userId: request.requesterId,
      message: `Your request for ${service.title} has been completed. ${service.creditsRequired} credits have been transferred.`,
      type: 'completed',
    });

    await Notification.create({
      userId: request.providerId,
      message: `You earned ${service.creditsRequired} credits from completing ${service.title}`,
      type: 'earned',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('serviceId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only requester can cancel their own requests
    if (request.requesterId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only requester can cancel requests' });
    }

    // Can only cancel pending or accepted requests (not completed)
    if (request.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed requests' });
    }

    request.status = 'cancelled';
    await request.save();

    // Create notification
    await Notification.create({
      userId: request.providerId,
      message: `Request for ${request.serviceId.title} has been cancelled`,
      type: 'cancelled',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
