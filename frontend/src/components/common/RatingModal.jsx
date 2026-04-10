import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import API from '../../utils/api';

const RatingModal = ({ isOpen, onClose, serviceId, requestId, revieweeId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) return;

    setLoading(true);

    try {
      await API.post('/reviews', {
        revieweeId,
        serviceId,
        requestId,
        rating,
        comment: feedback,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Rate Service</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">How was your experience with this service?</p>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <FiStar
                            className={`text-4xl ${star <= (hoveredRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Feedback</label>
                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder="Share your experience..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rating === 0 || !feedback.trim() || loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                      'Submit Rating'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
                <p className="text-gray-600">Your rating has been submitted successfully</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
