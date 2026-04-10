import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCheck, FiX, FiCheckCircle, FiUser, FiInfo, FiActivity, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import RatingModal from '../components/common/RatingModal';
import API from '../utils/api';

const MyRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState({
    pending: [],
    accepted: [],
    completed: [],
    cancelled: [],
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/requests/my-requests');

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      const grouped = {
        pending: data.filter(r => r.status === 'pending'),
        accepted: data.filter(r => r.status === 'accepted'),
        completed: data.filter(r => r.status === 'completed'),
        cancelled: data.filter(r => r.status === 'cancelled' || r.status === 'rejected'),
      };
      setRequests(grouped);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setError('Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const handleStatusUpdate = async (requestId, action) => {
    try {
      let endpoint;
      switch (action) {
        case 'accept':
          endpoint = `/requests/${requestId}/accept`;
          break;
        case 'reject':
          endpoint = `/requests/${requestId}/reject`;
          break;
        case 'complete':
          endpoint = `/requests/${requestId}/complete`;
          break;
        default:
          throw new Error('Invalid action');
      }
      
      await API.put(endpoint);
      loadRequests();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      alert(`Failed to ${action} request`);
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', color: 'yellow', icon: FiClock },
    { key: 'accepted', label: 'Accepted', color: 'blue', icon: FiActivity },
    { key: 'completed', label: 'Completed', color: 'green', icon: FiCheckCircle },
    { key: 'cancelled', label: 'Cancelled', color: 'red', icon: FiX },
  ];

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${classes[status] || 'bg-gray-100 text-gray-700'}`;
  };

  if (loading && !requests.pending.length && !requests.accepted.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Service Requests</h1>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          Showing your request activity
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100 flex items-center">
          <FiInfo className="mr-3 text-lg" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex p-1 space-x-1 bg-gray-200/50 rounded-xl mb-8 w-full md:w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${isActive
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              <Icon className="mr-2" />
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-300/50 text-gray-600'}`}>
                {requests[tab.key].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {requests[activeTab].length > 0 ? (
            requests[activeTab].map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={getStatusBadgeClass(request.status)}>
                          {request.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          Ref: {request._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{request.serviceId?.title || 'Unknown Service'}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {request.serviceId?.description || 'No description available for this service.'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiUser className="mr-2 text-primary" />
                          <span className="font-semibold mr-1">Provider:</span>
                          {request.providerId?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiUser className="mr-2 text-blue-500" />
                          <span className="font-semibold mr-1">Requester:</span>
                          {request.requesterId?.name || 'You'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="mr-2 text-gray-400" />
                          <span className="font-semibold mr-1">Date:</span>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[140px]">
                      <div className="bg-primary/5 p-3 rounded-xl text-center mb-2">
                        <p className="text-[10px] uppercase font-bold text-primary tracking-wider">Credits</p>
                        <p className="text-xl font-black text-primary">{request.serviceId?.creditsRequired || 0}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => navigate('/chat', { state: { requestId: request._id } })}
                          className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center transition-all shadow-sm"
                        >
                          <FiMessageSquare className="mr-2" />
                          Chat
                        </button>
                        
                        {/* Action Buttons based on status */}
                        {activeTab === 'pending' && request.providerId?._id === user?.id && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'accept')}
                              className="px-4 py-2.5 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 flex-1 shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'reject')}
                              className="px-4 py-2.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 flex-1 shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {activeTab === 'accepted' && request.providerId?._id === user?.id && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'complete')}
                            className="w-full px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-sm"
                          >
                            Mark as Completed
                          </button>
                        )}

                        {activeTab === 'completed' && request.requesterId?._id === user?.id && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRatingModal(true);
                            }}
                            className="w-full px-4 py-2.5 bg-yellow-500 text-white text-xs font-bold rounded-xl hover:bg-yellow-600 shadow-sm"
                          >
                            Rate Provider
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiActivity className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} requests</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {activeTab === 'pending'
                  ? "You don't have any incoming or outgoing requests waiting for action."
                  : `There are currently no services in the ${activeTab} category.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          serviceId={selectedRequest?.serviceId?._id}
          requestId={selectedRequest?._id}
          revieweeId={selectedRequest?.providerId?._id}
        />
      )}
    </div>
  );
};

export default MyRequests;
