import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMoreVertical, FiSearch, FiSmile, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import { io } from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userTypingStatus, setUserTypingStatus] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedChatRef = useRef(null);

  // Handle navigation from MyRequests
  useEffect(() => {
    if (user && location.state?.requestId) {
      handleInitialChat(location.state.requestId);
    }
  }, [user, location.state]);

  const handleInitialChat = async (requestId) => {
    try {
      const chat = await chatService.getOrCreateChat(requestId);
      if (selectedChatRef.current && socketRef.current) {
        socketRef.current.emit('leaveChat', selectedChatRef.current._id);
      }
      setSelectedChat(chat);
      selectedChatRef.current = chat;
      loadConversations();
      if (socketRef.current) {
        socketRef.current.emit('joinChat', chat._id);
      }
    } catch (error) {
      console.error('Error handling initial chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getMyChats();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations', error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      
      socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
      
      socketRef.current.on('connect', () => {
        socketRef.current.emit('joinUserRoom', user.id);
      });

      socketRef.current.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => {
          if (newMessage.chatId === selectedChatRef.current?._id) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
        
        loadConversations();
      });

      socketRef.current.on('newMessage', () => {
        loadConversations();
      });

      socketRef.current.on('userTyping', (data) => {
        setUserTypingStatus(prev => ({ ...prev, [data.chatId]: true }));
      });

      socketRef.current.on('userStopTyping', (data) => {
        setUserTypingStatus(prev => ({ ...prev, [data.chatId]: false }));
      });

      socketRef.current.on('userStatusUpdate', (data) => {
        setOnlineUsers(prev => ({ ...prev, [data.userId]: data.status === 'online' }));
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [user]);

  const handleSelectChat = (chat) => {
    if (selectedChatRef.current && socketRef.current) {
      socketRef.current.emit('leaveChat', selectedChatRef.current._id);
    }
    setSelectedChat(chat);
    selectedChatRef.current = chat;
    loadMessages(chat._id);
    if (socketRef.current) {
      socketRef.current.emit('joinChat', chat._id);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (selectedChat) {
      if (!isTyping) {
        setIsTyping(true);
        socketRef.current.emit('typing', { chatId: selectedChat._id, userId: user.id });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socketRef.current.emit('stopTyping', { chatId: selectedChat._id, userId: user.id });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const currentMessage = message;
    setMessage('');
    setIsTyping(false);
    clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit('stopTyping', { chatId: selectedChat._id, userId: user.id });

    try {
      socketRef.current.emit('sendMessage', {
        chatId: selectedChat._id,
        message: { senderId: user.id, text: currentMessage }
      });
      loadConversations();
    } catch (error) {
       console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user.id) || chat.participants[0];
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-sm border border-gray-100 my-4">
      {/* Conversations List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col z-10">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between text-gray-900 bg-white">
          <h2 className="text-xl font-bold tracking-tight">Messages</h2>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <FiMoreVertical size={20} />
          </button>
        </div>

        <div className="p-4 bg-white">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 custom-scrollbar">
          {conversations.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">
                No recent conversations.
             </div>
          ) : (
            <AnimatePresence>
            {conversations.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const isSelected = selectedChat?._id === chat._id;
              const unreadCount = chat.unreadCount?.[user.id] || 0;

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center p-4 mx-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50/60 border border-blue-100/50' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    {otherUser?.profilePhoto ? (
                      <img src={otherUser.profilePhoto} className="w-12 h-12 rounded-full object-cover shadow-sm bg-white" alt="Avatar"/>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/80 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {onlineUsers[otherUser?._id] && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-900 truncate pr-2">{otherUser?.name}</h3>
                      {chat.lastMessage && (
                        <span className="text-[11px] text-gray-400 font-medium shrink-0">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate pr-4 ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {userTypingStatus[chat._id] ? (
                          <span className="text-primary italic">typing...</span>
                        ) : (
                          chat.lastMessage?.content || 'Say hi'
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`w-full md:w-2/3 flex flex-col bg-slate-50 relative ${!selectedChat && 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            <div className="h-[76px] px-6 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
              <div className="flex items-center">
                <div className="relative">
                 {getOtherParticipant(selectedChat)?.profilePhoto ? (
                    <img src={getOtherParticipant(selectedChat).profilePhoto} className="w-10 h-10 rounded-full object-cover" alt="Avatar"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/80 to-blue-400 flex items-center justify-center text-white font-bold">
                       {getOtherParticipant(selectedChat)?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {onlineUsers[getOtherParticipant(selectedChat)?._id] && (
                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="font-bold text-gray-900">{getOtherParticipant(selectedChat)?.name}</h2>
                  <div className="flex items-center text-xs">
                    {userTypingStatus[selectedChat._id] ? (
                       <span className="text-primary font-medium">Typing...</span>
                    ) : (
                       <span className={onlineUsers[getOtherParticipant(selectedChat)?._id] ? "text-green-500 font-medium" : "text-gray-400"}>
                         {onlineUsers[getOtherParticipant(selectedChat)?._id] ? 'Online' : 'Offline'}
                       </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <FiMoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
              {messages.map((msg, index) => {
                const isMyMessage = (typeof msg.sender === 'object' ? msg.sender?._id : msg.sender) === user.id;

                return (
                  <motion.div
                    key={msg._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm relative group ${
                        isMyMessage 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                        <span className="text-[10px] font-medium opacity-80">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMyMessage && (
                          <FiCheck size={12} className="opacity-80" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <FiSmile size={22} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="w-full bg-gray-100/80 border-none rounded-full px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:bg-white text-gray-700 transition-all placeholder:text-gray-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`p-3.5 rounded-full flex items-center justify-center transition-all ${
                    message.trim() 
                      ? 'bg-primary text-white shadow-md hover:bg-blue-700 hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiSend size={20} className={message.trim() ? 'translate-x-0.5' : ''} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white m-4 rounded-3xl border border-gray-100 border-dashed">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Messages</h2>
            <p className="text-gray-500 max-w-md">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
