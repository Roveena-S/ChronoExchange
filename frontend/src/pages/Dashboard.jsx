import { motion } from 'framer-motion';
import { FiDollarSign, FiUsers, FiShoppingBag, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCredits: '10',
    activeServices: '0',
    completedExchanges: '0',
    averageRating: '0.0'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/users/dashboard');
        setStats({
          totalCredits: response.data.totalCredits.toString(),
          activeServices: response.data.activeServices.toString(),
          completedExchanges: response.data.completedExchanges.toString(),
          averageRating: response.data.averageRating
        });
        setRecentActivity(response.data.recentActivity);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to localStorage data
        const activities = JSON.parse(localStorage.getItem('activities') || '[]');
        setRecentActivity(activities.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { label: 'Total Credits', value: stats.totalCredits, icon: FiDollarSign, color: 'bg-blue-500' },
    { label: 'Active Services', value: stats.activeServices, icon: FiShoppingBag, color: 'bg-green-500' },
    { label: 'Completed Exchanges', value: stats.completedExchanges, icon: FiUsers, color: 'bg-purple-500' },
    { label: 'Average Rating', value: stats.averageRating, icon: FiTrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{loading ? '...' : stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Loading activity...</p>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div>
                  <p className="font-medium">{activity.action} - {activity.service}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {activity.isEarned ? (
                    <FiArrowUp className="text-green-600 text-xl" />
                  ) : (
                    <FiArrowDown className="text-red-600 text-xl" />
                  )}
                  <span className={`font-bold ${activity.isEarned ? 'text-green-600' : 'text-red-600'}`}>
                    {activity.creditChange} credits
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No activity yet. Start by browsing services or creating your own!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
