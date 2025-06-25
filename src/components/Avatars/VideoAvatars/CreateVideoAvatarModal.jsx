import { useState, useRef, useEffect } from 'react';
import { X, Upload, Video, Mic } from 'lucide-react';
import { createAvatar, SUPPORTED_VIDEO_FORMATS, AVATAR_MODELS } from '../../../api/avatarService';
import { getMyVoices } from '../../../api/voiceService';

const CreateVideoAvatarModal = ({ isOpen, onClose, onAvatarCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    model: AVATAR_MODELS.AKOOL,
    voiceId: '',
    audioModel: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const fetchVoices = async () => {
    try {
      const response = await getMyVoices();
      setVoices(response.data || []);
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    }
  };

  // Fetch voices when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVoices();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      setError('Please select a valid video file (MP4 or MOV)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    setError('');
    setVideoFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title for your avatar');
      return;
    }
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('avatarVideo', videoFile);
      submitData.append('model', formData.model);
      
      if (formData.voiceId) {
        submitData.append('voiceId', formData.voiceId);
      }
      
      if (formData.audioModel) {
        submitData.append('audioModel', formData.audioModel);
      }

      const response = await createAvatar(submitData);
      onAvatarCreated(response.data);
      
      // Reset form
      setFormData({
        title: '',
        model: AVATAR_MODELS.AKOOL,
        voiceId: '',
        audioModel: '',
      });
      setVideoFile(null);
      setVideoPreview(null);
      
    } catch (error) {
      console.error('Failed to create avatar:', error);
      setError(error.response?.data?.message || 'Failed to create avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setFormData({
      title: '',
      model: AVATAR_MODELS.AKOOL,
      voiceId: '',
      audioModel: '',
    });
    setVideoFile(null);
    setVideoPreview(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Video Avatar</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Avatar Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter avatar name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File *
            </label>
            
            {!videoPreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your video file here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP4, MOV files up to 50MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="video/mp4,video/quicktime"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(videoPreview);
                      setVideoPreview(null);
                      setVideoFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {videoFile?.name} ({(videoFile?.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              </div>
            )}
          </div>

          {/* Avatar Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Processing Model
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={AVATAR_MODELS.AKOOL}>Akool</option>
              <option value={AVATAR_MODELS.HEYGEN}>HeyGen</option>
              <option value={AVATAR_MODELS.SYNC}>Sync</option>
            </select>
          </div>

          {/* Voice Selection */}
          <div>
            <label htmlFor="voiceId" className="block text-sm font-medium text-gray-700 mb-2">
              Voice (Optional)
            </label>
            <select
              id="voiceId"
              name="voiceId"
              value={formData.voiceId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a voice</option>
              {voices.map((voice) => (
                <option key={voice._id} value={voice._id}>
                  {voice.title}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !videoFile}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Avatar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoAvatarModal;