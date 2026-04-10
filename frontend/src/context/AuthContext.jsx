import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

// Helper to normalize user ID
const getUserId = (user) => {
  if (!user) return null;
  return user.id || user._id;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Always fetch current user from server to ensure correct user
        const response = await API.get('/auth/me');
        const currentUser = response.data;
        
        const userId = getUserId(currentUser);
        if (currentUser && userId) {
          // Normalize user object to always have both id and _id
          const normalizedUser = {
            ...currentUser,
            id: userId,
            _id: userId
          };
          setUser(normalizedUser);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
          console.log('Auth initialized for user:', normalizedUser.name, 'ID:', userId);
        } else {
          throw new Error('Invalid user data - no ID found');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    const userId = getUserId(userData);
    if (!userData || !userId || !token) {
      console.error('Invalid login data:', userData);
      return;
    }
    // Normalize user object
    const normalizedUser = {
      ...userData,
      id: userId,
      _id: userId
    };
    console.log('Login successful for user:', normalizedUser.name, 'ID:', userId);
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    console.log('Logout - clearing user data');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    const userId = getUserId(userData);
    if (!userData || !userId) {
      console.error('Invalid user data for update:', userData);
      return;
    }
    // Normalize user object
    const normalizedUser = {
      ...userData,
      id: userId,
      _id: userId
    };
    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
