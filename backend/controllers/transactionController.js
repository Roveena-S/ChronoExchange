const Transaction = require('../models/Transaction');

exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.user.id }, { toUserId: req.user.id }]
    })
      .populate('fromUserId', 'name')
      .populate('toUserId', 'name')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });

    // Add user perspective to each transaction
    const transactionsWithPerspective = transactions.map(transaction => {
      const isProvider = transaction.toUserId._id.toString() === req.user.id;
      return {
        ...transaction.toObject(),
        isProvider,
        userType: isProvider ? 'provider' : 'requester'
      };
    });

    res.json(transactionsWithPerspective);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('fromUserId', 'name')
      .populate('toUserId', 'name')
      .populate('serviceId', 'title')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
