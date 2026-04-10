import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiStar, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Services = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await API.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleRequestService = async (service) => {
    try {
      await API.post('/requests', { serviceId: service._id });
      alert('Service requested successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await API.delete(`/services/${serviceId}`);
      setServices(services.filter(service => service._id !== serviceId));
      alert('Service deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const categories = ['all', 'Design', 'Photography', 'Writing', 'Development'];
  const locations = ['all', 'Remote', 'New York', 'Los Angeles'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || service.category === category;
    const matchesLocation = location === 'all' || service.location === location;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Services</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'all' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="card hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {service.category}
              </span>
              <div className="flex items-center text-yellow-500">
                <FiStar className="fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-700">{service.providerId?.rating || 0}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 overflow-hidden">{service.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FiClock className="mr-2" />
                {service.duration} hours
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FiMapPin className="mr-2" />
                {service.location}
              </div>
              <div className="flex items-center text-sm font-bold text-primary">
                <FiDollarSign className="mr-2" />
                {service.creditsRequired} Credits
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">by {service.providerId?.name || 'Unknown'}</span>
              <div className="flex gap-2">
                {service.providerId?._id === user?.id && (
                  <button 
                    onClick={() => handleDeleteService(service._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Service"
                  >
                    <FiTrash2 />
                  </button>
                )}
                <button 
                  onClick={() => handleRequestService(service)}
                  className="btn-primary text-sm"
                >
                  Request Service
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Services;
