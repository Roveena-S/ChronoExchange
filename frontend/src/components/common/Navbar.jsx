import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notif, index) => {
    // Remove notification
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    setShowNotifications(false);

    // Navigate based on notification type
    if (notif.title.includes('Service Request')) {
      navigate('/requests');
    } else if (notif.title.includes('Credits')) {
      navigate('/wallet');
    } else if (notif.title.includes('Message')) {
      navigate('/chat');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end space-x-4">
      {/* Notifications */}
      <div className="relative" ref={notificationRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <FiBell className="text-xl text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      onClick={() => handleNotificationClick(notif, index)}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white overflow-hidden">
            {user?.profilePhoto ? (
              <img 
                src={`http://localhost:5000${user.profilePhoto}`} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm font-medium">{user?.name}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
