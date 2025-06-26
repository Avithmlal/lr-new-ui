import { useState, useRef } from 'react';
import { X, Upload, Mic, Play, Pause } from 'lucide-react';
import { 
  createVoice, 
  SUPPORTED_AUDIO_FORMATS, 
  MAX_AUDIO_SIZE, 
  VOICE_MODELS,
  SCRIPT_CONSTRAINTS 
} from '../../../api/voiceService';

const CreateVoiceAvatarModal = ({ isOpen, onClose, onVoiceCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    script: '',
    model: VOICE_MODELS.AKOOL,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

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
    if (!SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
      setError('Please select a valid audio file (MP3, WAV, or OGG)');
      return;
    }

    // Validate file size
    if (file.size > MAX_AUDIO_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setAudioFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAudioPreview(previewUrl);
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

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const validateScript = (script) => {
    if (!script || script.trim().length === 0) {
      return 'Audio script is required';
    }
    if (script.length < SCRIPT_CONSTRAINTS.MIN_LENGTH) {
      return `Script must be at least ${SCRIPT_CONSTRAINTS.MIN_LENGTH} characters`;
    }
    if (script.length > SCRIPT_CONSTRAINTS.MAX_LENGTH) {
      return `Script cannot exceed ${SCRIPT_CONSTRAINTS.MAX_LENGTH} characters`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title for your voice avatar');
      return;
    }
    
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }

    const scriptError = validateScript(formData.script);
    if (scriptError) {
      setError(scriptError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('audio', audioFile);
      submitData.append('model', formData.model);
      submitData.append('script', formData.script.trim());

      const response = await createVoice(submitData);
      onVoiceCreated(response.data);
      
      // Reset form
      setFormData({
        title: '',
        script: '',
        model: VOICE_MODELS.AKOOL,
      });
      setAudioFile(null);
      setAudioPreview(null);
      setIsPlaying(false);
      
    } catch (error) {
      console.error('Failed to create voice:', error);
      setError(error.response?.data?.message || 'Failed to create voice avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setFormData({
      title: '',
      script: '',
      model: VOICE_MODELS.AKOOL,
    });
    setAudioFile(null);
    setAudioPreview(null);
    setIsPlaying(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Voice Avatar</h2>
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
              Voice Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter voice avatar name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File *
            </label>
            
            {!audioPreview ? (
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
                <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your audio file here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP3, WAV, OGG files up to 10MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{audioFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(audioFile?.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(audioPreview);
                      setAudioPreview(null);
                      setAudioFile(null);
                      setIsPlaying(false);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioPreview}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Script Input */}
          <div>
            <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-2">
              Training Script *
            </label>
            <textarea
              id="script"
              name="script"
              value={formData.script}
              onChange={handleInputChange}
              placeholder="Enter the text that represents your voice style (100-400 characters)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <div className="mt-1 flex justify-between text-sm">
              <span className={`${
                formData.script.length < SCRIPT_CONSTRAINTS.MIN_LENGTH 
                  ? 'text-red-500' 
                  : formData.script.length > SCRIPT_CONSTRAINTS.MAX_LENGTH 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {formData.script.length} characters
              </span>
              <span className="text-gray-500">
                {SCRIPT_CONSTRAINTS.MIN_LENGTH}-{SCRIPT_CONSTRAINTS.MAX_LENGTH} required
              </span>
            </div>
          </div>

          {/* Voice Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Voice Model
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={VOICE_MODELS.AKOOL}>Akool</option>
              <option value={VOICE_MODELS.ELEVENLABS}>ElevenLabs</option>
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
              disabled={loading || !formData.title.trim() || !audioFile || !formData.script.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Voice Avatar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoiceAvatarModal;