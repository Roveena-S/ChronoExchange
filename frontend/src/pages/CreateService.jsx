import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    customCategory: '',
    duration: '',
    credits: '',
    location: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = ['Design', 'Development', 'Writing', 'Photography', 'Marketing', 'Other'];

  // Auto-calculate credits based on duration (1 hour = 2 credits)
  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value) || 0;
    const calculatedCredits = duration * 2;
    setFormData({ 
      ...formData, 
      duration: e.target.value,
      credits: calculatedCredits.toString()
    });
    setErrors({ ...errors, duration: '', credits: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Custom category is required';
    }
    
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    if (!formData.credits || parseInt(formData.credits) <= 0) {
      newErrors.credits = 'Credits must be greater than 0';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const serviceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category === 'Other' ? formData.customCategory.trim() : formData.category,
        creditsRequired: parseInt(formData.credits),
        duration: parseInt(formData.duration),
        location: formData.location.trim(),
      };

      const response = await API.post('/services', serviceData);
      alert('Service created successfully!');
      navigate('/services');
    } catch (error) {
      console.error('Service creation error:', error);
      alert(error.response?.data?.message || 'Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Service Title</label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g., Teach Python Basics – 2 Hour Beginner Session"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: '' });
              }}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              rows="4"
              placeholder="Describe what users will get, skill level, tools needed, and whether it's online or offline..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: '' });
              }}
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setErrors({ ...errors, category: '' });
                }}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {formData.category === 'Other' && (
              <div>
                <label className="block text-sm font-medium mb-2">Custom Category</label>
                <input
                  type="text"
                  className={`input-field ${errors.customCategory ? 'border-red-500' : ''}`}
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={(e) => {
                    setFormData({ ...formData, customCategory: e.target.value });
                    setErrors({ ...errors, customCategory: '' });
                  }}
                  required
                />
                {errors.customCategory && <p className="text-red-500 text-sm mt-1">{errors.customCategory}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Duration (hours)</label>
              <input
                type="number"
                className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                placeholder="e.g., 2"
                value={formData.duration}
                onChange={handleDurationChange}
                required
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              <p className="text-sm text-gray-500 mt-1">Credits will be auto-calculated (1 hour = 2 credits)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Credits Required</label>
              <input
                type="number"
                className={`input-field ${errors.credits ? 'border-red-500' : ''}`}
                placeholder="Auto-calculated based on duration"
                value={formData.credits}
                onChange={(e) => {
                  setFormData({ ...formData, credits: e.target.value });
                  setErrors({ ...errors, credits: '' });
                }}
                required
              />
              {errors.credits && <p className="text-red-500 text-sm mt-1">{errors.credits}</p>}
              <p className="text-sm text-gray-500 mt-1">You can override the auto-calculated credits</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                placeholder="e.g., Remote or New York"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  setErrors({ ...errors, location: '' });
                }}
                required
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Service Images (Optional)</label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-all cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <FiUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </label>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Service'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateService;
