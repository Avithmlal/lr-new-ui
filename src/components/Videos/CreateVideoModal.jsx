import React, { useState } from 'react';
import { X, Video, Wand2, FileText, Sparkles, Play, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ProfessionalVideoModal } from './ProfessionalVideoModal';

export function CreateVideoModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'basic',
    projectId: '',
    avatar: '',
    language: 'English',
    resolution: '1080p',
    style: 'professional',
    includeSubtitles: true,
    backgroundMusic: false,
  });

  const videoTypes = [
    {
      id: 'basic',
      name: 'Basic Video',
      description: 'AI-generated video with avatar and voice synthesis, including media synchronization and professional quality.',
      icon: Video,
      features: [
        'AI avatar presenters',
        'Voice synthesis',
        'Media synchronization',
        'Professional quality'
      ],
      estimatedTime: '20-40 minutes'
    },
    {
      id: 'template',
      name: 'Template Based',
      description: 'Structured video following professional templates with advanced formatting and transitions.',
      icon: Sparkles,
      features: [
        'Professional templates',
        'Advanced transitions',
        'Custom branding',
        'Interactive elements'
      ],
      estimatedTime: '15-25 minutes'
    }
  ];

  const availableAvatars = [
    { id: 'sarah', name: 'Professional Sarah', style: 'professional' },
    { id: 'mike', name: 'Friendly Mike', style: 'casual' },
    { id: 'emma', name: 'Casual Emma', style: 'friendly' },
    { id: 'david', name: 'Expert David', style: 'authoritative' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.projectId || !formData.avatar) return;

    const newVideo = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      projectId: formData.projectId,
      projectTitle: state.projects.find(p => p.id === formData.projectId)?.title || 'Unknown Project',
      status: 'generating',
      duration: 0,
      thumbnailUrl: `https://images.pexels.com/photos/${4164418 + Math.floor(Math.random() * 100)}/pexels-photo-${4164418 + Math.floor(Math.random() * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      videoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      creator: {
        name: 'Current User',
        email: 'user@example.com',
        avatar: availableAvatars.find(a => a.id === formData.avatar)?.name || 'Unknown Avatar'
      },
      metadata: {
        resolution: formData.resolution,
        format: 'mp4',
        size: null,
        avatar: availableAvatars.find(a => a.id === formData.avatar)?.name || 'Unknown Avatar',
        language: formData.language,
        style: formData.style,
        includeSubtitles: formData.includeSubtitles,
        backgroundMusic: formData.backgroundMusic
      }
    };

    // Add video to state
    dispatch({ type: 'ADD_VIDEO', payload: newVideo });

    // Show generation message
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Video Generation Started',
        message: `"${formData.title}" is being generated. This may take ${videoTypes.find(t => t.id === formData.type)?.estimatedTime}.`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Simulate video generation completion
    setTimeout(() => {
      const completedVideo = {
        ...newVideo,
        status: 'completed',
        duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        videoUrl: '#generated-video-url',
        metadata: {
          ...newVideo.metadata,
          size: `${(Math.random() * 100 + 20).toFixed(1)} MB`
        }
      };

      dispatch({ type: 'UPDATE_VIDEO', payload: completedVideo });
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Video Generated Successfully',
          message: `"${formData.title}" is ready to watch!`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }, 8000);

    // Reset form and close modal
    setFormData({
      title: '',
      description: '',
      type: 'basic',
      projectId: '',
      avatar: '',
      language: 'English',
      resolution: '1080p',
      style: 'professional',
      includeSubtitles: true,
      backgroundMusic: false,
    });
    setCurrentStep(1);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'basic',
      projectId: '',
      avatar: '',
      language: 'English',
      resolution: '1080p',
      style: 'professional',
      includeSubtitles: true,
      backgroundMusic: false,
    });
    setCurrentStep(1);
    onClose();
  };

  const handleTypeSelect = (type) => {
    if (type === 'basic') {
      setShowProfessionalModal(true);
      onClose();
      return;
    }
    
    setFormData(prev => ({ ...prev, type }));
  };

  if (!isOpen) return null;

  if (showProfessionalModal) {
    return <ProfessionalVideoModal isOpen={true} onClose={() => {
      setShowProfessionalModal(false);
      onClose();
    }} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter video title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this video will cover..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a project...</option>
                    {state.projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Video Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                        formData.type === type.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <type.icon className={`w-6 h-6 ${
                          formData.type === type.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600">Est. {type.estimatedTime}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{type.description}</p>
                    
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choose Avatar</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableAvatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        onClick={() => setFormData(prev => ({ ...prev, avatar: avatar.id }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.avatar === avatar.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-medium text-gray-900">{avatar.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{avatar.style}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <select
                      value={formData.resolution}
                      onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="720p">720p HD</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="4k">4K Ultra HD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Style</label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="educational">Educational</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Include Subtitles</p>
                      <p className="text-sm text-gray-600">Add automatic subtitles to your video</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeSubtitles}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeSubtitles: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Background Music</p>
                      <p className="text-sm text-gray-600">Add subtle background music</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.backgroundMusic}
                        onChange={(e) => setFormData(prev => ({ ...prev, backgroundMusic: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Video</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Video Type</span>
            <span>Settings</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {renderStepContent()}
        </form>
        
        <div className="flex justify-between space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && (!formData.title || !formData.projectId)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.title || !formData.projectId || !formData.avatar}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4 mr-2 inline" />
                Generate Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}