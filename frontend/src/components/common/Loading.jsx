import { motion } from 'framer-motion';

const Loading = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const Spinner = () => (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizes[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner />
          <p className="mt-4 text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  );
};

export default Loading;
