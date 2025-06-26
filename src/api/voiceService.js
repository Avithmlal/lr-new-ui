import axiosInstance from './axiosInstance';

// Get all user's voice avatars
export const getMyVoices = async (page = 1, limit = 10, searchKey = '', sortField = '', sortOrder = '') => {
  const params = { pageNo: page, limit };
  
  if (searchKey) params.searchKey = searchKey;
  if (sortField) params.sortField = sortField;
  if (sortOrder) params.sortOrder = sortOrder;
  
  const response = await axiosInstance.get('/admin/voices', { params });
  return response.data;
};

// Get specific voice avatar by ID
export const getMyVoiceById = async (voiceId) => {
  const response = await axiosInstance.get(`/admin/voices/${voiceId}`);
  return response.data;
};

// Create new voice avatar
export const createVoice = async (formData) => {
  const response = await axiosInstance.post('/admin/voices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update voice avatar properties
export const updateMyVoiceById = async (voiceId, data) => {
  const response = await axiosInstance.patch(`/admin/voices/${voiceId}`, data);
  return response.data;
};

// Delete voice avatar
export const deleteMyVoiceById = async (voiceId) => {
  const response = await axiosInstance.delete(`/admin/voices/${voiceId}`);
  return response.data;
};

// Get ElevenLabs studio voices
export const getStudioVoices = async () => {
  const response = await axiosInstance.get('/admin/voices/studio/elevenlabs');
  return response.data;
};

// Voice status constants
export const VOICE_STATUS = {
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  UPLOADED: 'UPLOADED',
};

// Supported audio formats
export const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];

// Voice creation models
export const VOICE_MODELS = {
  AKOOL: 'akool',
  ELEVENLABS: 'elevenlabs',
};

// Audio file size limit (10MB)
export const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

// Script length constraints
export const SCRIPT_CONSTRAINTS = {
  MIN_LENGTH: 100,
  MAX_LENGTH: 400,
};