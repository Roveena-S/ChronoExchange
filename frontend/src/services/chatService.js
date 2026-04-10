import API from '../utils/api';

const chatService = {
  getMyChats: async () => {
    const response = await API.get('/chats');
    return response.data;
  },

  getMessages: async (chatId, page = 1) => {
    const response = await API.get(`/chats/${chatId}/messages?page=${page}`);
    return response.data;
  },

  getOrCreateChat: async (requestId) => {
    const response = await API.get(`/chats/request/${requestId}`);
    return response.data;
  },

  sendMessage: async (chatId, message) => {
    // using the route they had or just standard
    const response = await API.post(`/chats/${chatId}/message`, { message });
    return response.data;
  }
};

export default chatService;
