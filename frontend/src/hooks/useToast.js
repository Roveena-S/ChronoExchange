import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ isVisible: true, message, type });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, hideToast };
};
