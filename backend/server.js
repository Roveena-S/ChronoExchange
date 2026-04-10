const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Online users tracking
const onlineUsers = new Map(); // userId -> socketId

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join user to their personal room for notifications
  socket.on('joinUserRoom', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle joining chat rooms
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat: ${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat: ${chatId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('userTyping', {
      userId: data.userId,
      chatId: data.chatId
    });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.chatId).emit('userStopTyping', {
      userId: data.userId,
      chatId: data.chatId
    });
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    const { chatId, message } = data;
    const { senderId, text } = message;
    
    console.log('Received sendMessage:', { chatId, senderId, text });
    
    // Validation
    if (!chatId || !senderId || !text || text.trim() === '') {
      socket.emit('error', { message: 'Invalid message data' });
      return;
    }

    try {
      // Get Chat model
      const Chat = require('./models/Chat');
      const Message = require('./models/Message');
      
      // Find chat to get receiver
      const chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      // Determine receiver (the other participant)
      const receiverId = chat.participants.find(
        p => p.toString() !== senderId
      );

      if (!receiverId) {
        socket.emit('error', { message: 'Receiver not found' });
        return;
      }

      // Create and save message
      const newMessage = new Message({
        chatId: chatId,
        sender: senderId,
        receiver: receiverId,
        content: text.trim(),
        read: false
      });

      await newMessage.save();

      // Update chat's last message
      chat.lastMessage = newMessage._id;
      await chat.save();

      // Populate sender info for the response
      await newMessage.populate('sender', 'name profilePhoto');

      const messageData = {
        _id: newMessage._id,
        chatId: chatId,
        sender: newMessage.sender,
        receiver: receiverId,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        read: newMessage.read
      };

      console.log('Broadcasting message:', messageData);

      // Broadcast to all users in the chat room
      io.to(chatId).emit('receiveMessage', messageData);
      
      // Also notify the receiver if they're not in the room
      io.to(`user_${receiverId}`).emit('newMessage', messageData);

    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message: ' + error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    // Clean up online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('userStatusUpdate', { userId, status: 'offline' });
        break;
      }
    }
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
