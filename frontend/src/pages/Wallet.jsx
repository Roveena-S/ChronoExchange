import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Wallet = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    earned: 0,
    spent: 0,
  });

  useEffect(() => {
    loadTransactions();
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setStats({
        total: data.totalCredits,
        earned: data.creditsEarned,
        spent: data.creditsSpent,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data } = await API.get('/transactions/my-transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const walletStats = [
    { label: 'Total Credits', value: stats.total.toString(), icon: FiDollarSign, color: 'bg-blue-500' },
    { label: 'Credits Earned', value: stats.earned.toString(), icon: FiTrendingUp, color: 'bg-green-500' },
    { label: 'Credits Spent', value: stats.spent.toString(), icon: FiTrendingDown, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {walletStats.map((stat, index) => {
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
                  <p className="text-4xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-14 h-14 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">From/To</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Credits</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="py-4 px-4 text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {transaction.isProvider ? (
                          <div className="flex items-center text-green-600">
                            <FiArrowDownLeft className="mr-2" />
                            <span className="font-medium">Earned</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <FiArrowUpRight className="mr-2" />
                            <span className="font-medium">Lost</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {transaction.transactionType === 'earned' ? transaction.fromUserId?.name : transaction.toUserId?.name}
                    </td>
                    <td className="py-4 px-4 text-sm">{transaction.serviceId?.title || 'Service'}</td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${
                        transaction.transactionType === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transactionType === 'earned' ? '+' : '-'}{transaction.credits}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        completed
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No transactions yet. Start exchanging services to see your transaction history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
