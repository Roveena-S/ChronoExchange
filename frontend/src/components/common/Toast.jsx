import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="text-2xl" />,
    error: <FiAlertCircle className="text-2xl" />,
    info: <FiInfo className="text-2xl" />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50"
        >
          <div className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}>
            {icons[type]}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
