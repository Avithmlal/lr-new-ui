import axiosInstance from './axiosInstance';

// Get all user's video avatars
export const getMyAvatars = async (page = 1, limit = 10, searchKey = '', sortField = '', sortOrder = '') => {
  const params = { pageNo: page, limit };
  
  if (searchKey) params.searchKey = searchKey;
  if (sortField) params.sortField = sortField;
  if (sortOrder) params.sortOrder = sortOrder;
  
  const response = await axiosInstance.get('/admin/avatars', { params });
  return response.data;
};

// Get specific avatar by ID (includes video URL)
export const getMyAvatarById = async (avatarId) => {
  const response = await axiosInstance.get(`/admin/avatars/${avatarId}`);
  return response.data;
};

// Get avatar with video URL for preview
export const getAvatarWithVideo = async (avatarId) => {
  const response = await axiosInstance.get(`/admin/avatars/${avatarId}`);
  return response.data;
};

// Create new video avatar
export const createAvatar = async (formData) => {
  const response = await axiosInstance.post('/admin/avatars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update avatar properties
export const updateMyAvatarById = async (avatarId, data) => {
  const response = await axiosInstance.patch(`/admin/avatars/${avatarId}`, data);
  return response.data;
};

// Delete avatar
export const deleteMyAvatarById = async (avatarId) => {
  const response = await axiosInstance.delete(`/admin/avatars/${avatarId}`);
  return response.data;
};

// Get HeyGen studio avatars
export const getStudioAvatars = async () => {
  const response = await axiosInstance.get('/admin/avatars/studio/heygen');
  return response.data;
};

// Avatar status constants
export const AVATAR_STATUS = {
  CREATED: 'CREATED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

// Supported video formats
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime'];

// Avatar creation models
export const AVATAR_MODELS = {
  AKOOL: 'akool',
  HEYGEN: 'heygen',
  SYNC: 'sync',
};