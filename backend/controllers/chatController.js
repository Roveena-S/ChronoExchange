const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Request = require('../models/Request');

exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name profilePhoto')
      .populate({
        path: 'lastMessage',
        select: 'content createdAt read'
      })
      .populate('requestId')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.unreadCount && chat.unreadCount.get(req.user.id) > 0) {
      chat.unreadCount.set(req.user.id, 0);
      await chat.save();
    }

    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrCreateChat = async (req, res) => {
  try {
    const { requestId } = req.body || req.params;
    
    if (!requestId) return res.status(400).json({ message: "Request ID is required" });

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.requesterId.toString() !== req.user.id && request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this chat' });
    }

    let chat = await Chat.findOne({ requestId });

    if (!chat) {
      chat = new Chat({
        participants: [request.requesterId, request.providerId],
        requestId
      });
      await chat.save();
    }

    await chat.populate('participants', 'name profilePhoto');
    await chat.populate('requestId');

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat || !chat.participants.includes(req.user.id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const receiverId = chat.participants.find(p => p.toString() !== req.user.id);

    const newMessage = new Message({
      chatId,
      sender: req.user.id,
      receiver: receiverId,
      content: message,
    });

    await newMessage.save();

    chat.lastMessage = newMessage._id;
    
    if (!chat.unreadCount) chat.unreadCount = new Map();
    const currentUnread = chat.unreadCount.get(receiverId.toString()) || 0;
    chat.unreadCount.set(receiverId.toString(), currentUnread + 1);

    await chat.save();

    await newMessage.populate('sender', 'name profilePhoto');

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
