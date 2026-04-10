import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUser, FiPlusCircle, FiShoppingBag, FiList, 
  FiDollarSign, FiCreditCard, FiMessageSquare, FiUsers,
  FiBarChart2, FiChevronLeft, FiChevronRight, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userMenuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/create-service', icon: FiPlusCircle, label: 'Create Service' },
    { path: '/services', icon: FiShoppingBag, label: 'Browse Services' },
    { path: '/requests', icon: FiList, label: 'My Requests' },
    { path: '/wallet', icon: FiDollarSign, label: 'Wallet' },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat' },
  ];

  const adminMenuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/services', icon: FiShoppingBag, label: 'Services' },
    { path: '/wallet', icon: FiDollarSign, label: 'Transactions' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40"
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-primary"
          >
            ChronoExchange
          </motion.h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="text-xl" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <FiLogOut className="text-xl" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
