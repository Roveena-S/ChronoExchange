import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FiUsers, FiRepeat, FiDollarSign } from 'react-icons/fi';

const Analytics = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: FiUsers, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Exchanges', value: '856', icon: FiRepeat, color: 'bg-green-500', change: '+8%' },
    { label: 'Credits Circulated', value: '4,521', icon: FiDollarSign, color: 'bg-purple-500', change: '+15%' },
  ];

  const monthlyData = [
    { month: 'Jan', exchanges: 45 },
    { month: 'Feb', exchanges: 52 },
    { month: 'Mar', exchanges: 61 },
    { month: 'Apr', exchanges: 58 },
    { month: 'May', exchanges: 70 },
    { month: 'Jun', exchanges: 85 },
  ];

  const categoryData = [
    { name: 'Design', value: 35 },
    { name: 'Development', value: 25 },
    { name: 'Writing', value: 20 },
    { name: 'Photography', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const activeUsersData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 145 },
    { month: 'Mar', users: 168 },
    { month: 'Apr', users: 192 },
    { month: 'May', users: 215 },
    { month: 'Jun', users: 240 },
  ];

  const creditsFlowData = [
    { month: 'Jan', credits: 320 },
    { month: 'Feb', credits: 450 },
    { month: 'Mar', credits: 580 },
    { month: 'Apr', credits: 620 },
    { month: 'May', credits: 750 },
    { month: 'Jun', credits: 890 },
  ];

  const COLORS = ['#4F46E5', '#6366F1', '#22C55E', '#F59E0B', '#EF4444'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
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
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Exchanges Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4">Monthly Exchanges</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="exchanges" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4">Top Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Active Users Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4">Active Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeUsersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Credits Flow Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4">Total Credits Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={creditsFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="credits" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
