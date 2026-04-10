import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiMail, FiDollarSign, FiStar, FiX, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    skillsOffered: [],
    skillsNeeded: [],
    profilePhoto: null,
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillNeeded, setNewSkillNeeded] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setEditData({
        name: data.name,
        bio: data.bio || '',
        skillsOffered: data.skillsOffered || [],
        skillsNeeded: data.skillsNeeded || [],
        profilePhoto: null,
      });
      updateUser(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Upload profile photo first if there's a new one
      if (editData.profilePhoto instanceof File) {
        const formData = new FormData();
        formData.append('profilePhoto', editData.profilePhoto);
        
        const photoResponse = await API.post('/users/profile-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update user data with new photo
        updateUser(photoResponse.data.user);
      }
      
      // Update other profile data
      const { data } = await API.put('/users/profile', {
        name: editData.name,
        bio: editData.bio,
        skillsOffered: editData.skillsOffered,
        skillsNeeded: editData.skillsNeeded,
      });
      updateUser(data);
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, profilePhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setEditData({ ...editData, profilePhoto: null });
    setPhotoPreview(null);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditData({
        ...editData,
        skillsOffered: [...editData.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillNeeded = () => {
    if (newSkillNeeded.trim()) {
      setEditData({
        ...editData,
        skillsNeeded: [...editData.skillsNeeded, newSkillNeeded.trim()]
      });
      setNewSkillNeeded('');
    }
  };

  const removeSkillOffered = (index) => {
    setEditData({
      ...editData,
      skillsOffered: editData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillNeeded = (index) => {
    setEditData({
      ...editData,
      skillsNeeded: editData.skillsNeeded.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-32 h-32 bg-primary rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {user?.profilePhoto ? (
                <img 
                  src={`http://localhost:5000${user.profilePhoto}`} 
                  alt={user?.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
            <p className="text-gray-500 flex items-center justify-center mt-2">
              <FiMail className="mr-2" />
              {user?.email}
            </p>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-primary mt-6 w-full flex items-center justify-center"
            >
              <FiEdit2 className="mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Stats Card */}
          <div className="card mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Credits</span>
                <span className="font-bold text-xl flex items-center">
                  <FiDollarSign className="text-green-600 mr-1" />
                  {user?.totalCredits || 10}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Exchanges</span>
                <span className="font-bold text-xl">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-bold text-xl flex items-center">
                  <FiStar className="text-yellow-500 mr-1" />
                  0.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="text-gray-600 mb-6">{editData.bio || 'No bio added yet'}</p>

            <h3 className="text-xl font-bold mb-4">Skills Offered</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {editData.skillsOffered?.length > 0 ? (
                editData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>

            <h3 className="text-xl font-bold mb-4">Skills Needed</h3>
            <div className="flex flex-wrap gap-2">
              {editData.skillsNeeded?.length > 0 ? (
                editData.skillsNeeded.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Profile Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : user?.profilePhoto ? (
                        <img 
                          src={`http://localhost:5000${user.profilePhoto}`} 
                          alt={user?.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="btn-primary cursor-pointer">
                        <FiUpload className="inline mr-2" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills Offered</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Add a skill"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                    />
                    <button onClick={addSkillOffered} className="btn-primary">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editData.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillOffered(index)}
                          className="ml-2 text-red-500"
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills Needed</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Add a skill"
                      value={newSkillNeeded}
                      onChange={(e) => setNewSkillNeeded(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillNeeded()}
                    />
                    <button onClick={addSkillNeeded} className="btn-primary">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editData.skillsNeeded.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillNeeded(index)}
                          className="ml-2 text-red-500"
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="btn-primary flex-1">
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
