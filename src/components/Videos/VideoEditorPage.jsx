import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  X, 
  Video as VideoIcon, 
  Mic, 
  ChevronRight, 
  ChevronLeft,
  Loader,
  Check,
  Wand2,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import { ScriptEditor } from './ScriptEditor';
import { useApp } from '../../contexts/AppContext';

// Avatar data for selection
const AVATARS = [
  { id: 'heygen-sarah', name: 'Sarah - Professional', provider: 'Heygen', style: 'Business Professional', gender: 'Female', thumbnailUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'heygen-mike', name: 'Mike - Casual', provider: 'Heygen', style: 'Casual Presenter', gender: 'Male', thumbnailUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'heygen-emma', name: 'Emma - Educational', provider: 'Heygen', style: 'Educational Expert', gender: 'Female', thumbnailUrl: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'heygen-david', name: 'David - Executive', provider: 'Heygen', style: 'Executive Leader', gender: 'Male', thumbnailUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'akool-lisa', name: 'Lisa - Tech Expert', provider: 'Akool', style: 'Technology Specialist', gender: 'Female', thumbnailUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'akool-james', name: 'James - Creative', provider: 'Akool', style: 'Creative Director', gender: 'Male', thumbnailUrl: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'akool-anna', name: 'Anna - Consultant', provider: 'Akool', style: 'Business Consultant', gender: 'Female', thumbnailUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'akool-robert', name: 'Robert - Trainer', provider: 'Akool', style: 'Corporate Trainer', gender: 'Male', thumbnailUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150', previewUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

// Voice data for selection
const VOICES = [
  { id: 'heygen-voice-1', name: 'Professional Female', provider: 'Heygen', gender: 'Female', accent: 'American', tone: 'Professional', previewUrl: 'https://example.com/audio/professional-female.mp3' },
  { id: 'heygen-voice-2', name: 'Confident Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Confident', previewUrl: 'https://example.com/audio/confident-male.mp3' },
  { id: 'heygen-voice-3', name: 'Warm Female', provider: 'Heygen', gender: 'Female', accent: 'British', tone: 'Warm', previewUrl: 'https://example.com/audio/warm-female.mp3' },
  { id: 'heygen-voice-4', name: 'Authoritative Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Authoritative', previewUrl: 'https://example.com/audio/authoritative-male.mp3' },
  { id: 'akool-voice-1', name: 'Friendly Female', provider: 'Akool', gender: 'Female', accent: 'American', tone: 'Friendly', previewUrl: 'https://example.com/audio/friendly-female.mp3' },
  { id: 'akool-voice-2', name: 'Dynamic Male', provider: 'Akool', gender: 'Male', accent: 'American', tone: 'Dynamic', previewUrl: 'https://example.com/audio/dynamic-male.mp3' },
  { id: 'akool-voice-3', name: 'Elegant Female', provider: 'Akool', gender: 'Female', accent: 'British', tone: 'Elegant', previewUrl: 'https://example.com/audio/elegant-female.mp3' },
  { id: 'akool-voice-4', name: 'Persuasive Male', provider: 'Akool', gender: 'Male', accent: 'Australian', tone: 'Persuasive', previewUrl: 'https://example.com/audio/persuasive-male.mp3' },
];

export function VideoEditorPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [videoData, setVideoData] = useState(null);
  const [selectedModel, setSelectedModel] = useState('heygen');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [previewingAvatar, setPreviewingAvatar] = useState(null);
  const [previewingVoice, setPreviewingVoice] = useState(null);
  const [script, setScript] = useState('');
  const [mediaAnnotations, setMediaAnnotations] = useState([]);
  const [audioSegments, setAudioSegments] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPreviewSegments, setAudioPreviewSegments] = useState([]);
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [finalVideo, setFinalVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Find the video in the state
    const video = state.videos?.find(v => v.id === videoId);
    if (video) {
      setVideoData(video);
      // Initialize with any existing data
      if (video.script) {
        setScript(video.script);
      }
      if (video.videoAvatar) {
        setSelectedAvatar(video.videoAvatar);
      }
      if (video.audioAvatar) {
        setSelectedVoice(video.audioAvatar);
      }
      if (video.mediaAnnotations) {
        setMediaAnnotations(video.mediaAnnotations);
      }
      
      // If video is already completed, show the final step with the video
      if (video.status === 'completed' && video.videoUrl) {
        setCurrentStep(4);
        setFinalVideo({
          url: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          title: video.title,
          duration: video.duration
        });
      }
    } else {
      // If video not found, redirect to videos page
      navigate('/videos');
    }
  }, [videoId, state.videos, navigate]);

  // Auto-split script into segments when script changes
  useEffect(() => {
    if (script) {
      const sentences = script.match(/[^\.!?]+[\.!?]+/g) || [];
      const segments = [];
      
      for (let i = 0; i < sentences.length; i += 2) {
        const segment = sentences.slice(i, i + 2).join(' ').trim();
        if (segment) {
          segments.push({
            id: i / 2 + 1,
            text: segment,
            audioUrl: null,
            isGenerated: false,
            duration: 0
          });
        }
      }
      
      setAudioSegments(segments);
    }
  }, [script]);

  const handleClose = () => {
    navigate('/videos');
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Update video data in state
    const updatedVideo = {
      ...videoData,
      script,
      videoAvatar: selectedAvatar,
      audioAvatar: selectedVoice,
      mediaAnnotations,
      updatedAt: new Date()
    };
    
    dispatch({ type: 'UPDATE_VIDEO', payload: updatedVideo });
    
    // Show success message
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Video Saved',
        message: 'Your video script and annotations have been saved successfully.',
        timestamp: new Date(),
        isRead: false,
      }
    });
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const generatePreviewAudio = async () => {
    setIsGeneratingAudio(true);
    const previewSegments = audioSegments.slice(0, 3);
    
    // Simulate audio generation
    for (let i = 0; i < previewSegments.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAudioPreviewSegments(prev => [
        ...prev,
        {
          ...previewSegments[i],
          audioUrl: `#audio-${previewSegments[i].id}`,
          isGenerated: true,
          duration: Math.floor(Math.random() * 10) + 5
        }
      ]);
    }
    
    setIsGeneratingAudio(false);
  };

  const generateAllAudio = async () => {
    setIsGeneratingAudio(true);
    const allSegments = [...audioSegments];
    
    // Simulate generating all segments
    for (let i = 0; i < allSegments.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      allSegments[i] = {
        ...allSegments[i],
        audioUrl: `#audio-${allSegments[i].id}`,
        isGenerated: true,
        duration: Math.floor(Math.random() * 10) + 5
      };
      
      setAudioSegments([...allSegments]);
    }
    
    setIsGeneratingAudio(false);
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    
    // Simulate video generation progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setGenerationProgress(i);
    }
    
    // Create final video object
    const finalVideoObj = {
      url: 'https://example.com/video.mp4', // In a real app, this would be the actual video URL
      thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: videoData.title,
      duration: Math.floor(Math.random() * 600) + 300 // Random duration between 5-15 minutes
    };
    
    setFinalVideo(finalVideoObj);
    
    // Update video status to completed
    const completedVideo = {
      ...videoData,
      status: 'completed',
      duration: finalVideoObj.duration,
      thumbnailUrl: finalVideoObj.thumbnailUrl,
      videoUrl: finalVideoObj.url,
      updatedAt: new Date()
    };
    
    dispatch({ type: 'UPDATE_VIDEO', payload: completedVideo });
    
    // Show success message
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Video Generated',
        message: 'Your video has been successfully generated and is ready to view.',
        timestamp: new Date(),
        isRead: false,
      }
    });
    
    setIsGenerating(false);
  };

  const getFilteredAvatars = () => {
    return AVATARS.filter(avatar => avatar.provider.toLowerCase() === selectedModel.toLowerCase());
  };

  const getFilteredVoices = () => {
    return VOICES.filter(voice => voice.provider.toLowerCase() === selectedModel.toLowerCase());
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedModel && selectedAvatar && selectedVoice;
      case 2:
        return script.length > 0;
      case 3:
        return audioSegments.length > 0 && audioSegments.every(s => s.isGenerated);
      default:
        return true;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePreviewAvatar = (avatar) => {
    setPreviewingAvatar(avatar);
  };

  const handlePreviewVoice = (voice) => {
    setPreviewingVoice(voice);
    // Simulate playing voice sample
    setTimeout(() => {
      setPreviewingVoice(null);
    }, 3000);
  };

  if (!videoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                {videoData.title}
              </h1>
              <p className="text-gray-600 text-sm">Professional Video Editor</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {currentStep === 2 && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Close Editor
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Select Avatar & Voice' },
              { step: 2, label: 'Script & Media' },
              { step: 3, label: 'Audio Generation' },
              { step: 4, label: 'Generate Video' }
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep
                    ? 'bg-green-600 text-white'
                    : step === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                <div className="text-sm font-medium text-gray-700 ml-2">{label}</div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select AI Model</h2>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedModel('heygen')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedModel === 'heygen'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <VideoIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Heygen</h3>
                      <p className="text-sm text-gray-600">Professional AI avatars</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">High-quality AI avatars with natural expressions and professional appearance.</p>
                </div>

                <div
                  onClick={() => setSelectedModel('akool')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedModel === 'akool'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <VideoIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Akool</h3>
                      <p className="text-sm text-gray-600">Versatile AI avatars</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">Versatile AI avatars with a wide range of styles and customization options.</p>
                </div>
              </div>
            </div>

            {/* Avatar Preview Modal */}
            {previewingAvatar && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{previewingAvatar.name} Preview</h3>
                    <button
                      onClick={() => setPreviewingAvatar(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={previewingAvatar.previewUrl} 
                        alt={previewingAvatar.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg">
                          <Play className="w-8 h-8 text-gray-800" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Provider</p>
                        <p className="text-gray-900">{previewingAvatar.provider}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Style</p>
                        <p className="text-gray-900">{previewingAvatar.style}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Gender</p>
                        <p className="text-gray-900">{previewingAvatar.gender}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Best For</p>
                        <p className="text-gray-900">
                          {previewingAvatar.style.includes('Professional') ? 'Corporate Videos' : 
                           previewingAvatar.style.includes('Educational') ? 'Training Content' : 
                           'Casual Presentations'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setPreviewingAvatar(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAvatar(previewingAvatar.id);
                          setPreviewingAvatar(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Select This Avatar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Preview Modal */}
            {previewingVoice && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{previewingVoice.name} Preview</h3>
                    <button
                      onClick={() => setPreviewingVoice(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{previewingVoice.name}</p>
                        <p className="text-sm text-gray-600">{previewingVoice.accent} • {previewingVoice.tone}</p>
                      </div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                          <Volume2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Currently playing a sample of this voice. This voice is perfect for {previewingVoice.tone.toLowerCase()} content with a {previewingVoice.accent} accent.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Provider</p>
                        <p className="text-gray-900">{previewingVoice.provider}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Gender</p>
                        <p className="text-gray-900">{previewingVoice.gender}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setPreviewingVoice(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVoice(previewingVoice.id);
                          setPreviewingVoice(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Select This Voice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Video Avatar</h2>
              <div className="grid grid-cols-4 gap-4">
                {getFilteredAvatars().map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`border-2 rounded-lg cursor-pointer transition-all overflow-hidden ${
                      selectedAvatar === avatar.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={avatar.thumbnailUrl}
                        alt={avatar.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <div className="flex space-x-2 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewAvatar(avatar);
                            }}
                            className="p-2 bg-white rounded-full shadow-lg"
                          >
                            <Play className="w-4 h-4 text-gray-800" />
                          </button>
                          <button
                            onClick={() => setSelectedAvatar(avatar.id)}
                            className="p-2 bg-blue-600 rounded-full shadow-lg"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-900 text-sm">{avatar.name}</p>
                      <p className="text-xs text-gray-600">{avatar.style}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Voice</h2>
              <div className="grid grid-cols-2 gap-4">
                {getFilteredVoices().map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedVoice === voice.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{voice.name}</p>
                        <p className="text-sm text-gray-600">{voice.accent} • {voice.tone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(voice);
                          }}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          <Volume2 className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => setSelectedVoice(voice.id)}
                          className={`p-2 rounded-full ${
                            selectedVoice === voice.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Selected Avatar & Voice Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-6">
                {selectedAvatar && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img 
                        src={AVATARS.find(a => a.id === selectedAvatar)?.thumbnailUrl} 
                        alt="Selected Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Video Avatar</p>
                      <p className="font-medium text-gray-900">{AVATARS.find(a => a.id === selectedAvatar)?.name}</p>
                    </div>
                  </div>
                )}
                
                {selectedVoice && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Mic className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Voice</p>
                      <p className="font-medium text-gray-900">{VOICES.find(v => v.id === selectedVoice)?.name}</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-600 hover:text-blue-800 text-sm ml-auto"
                >
                  Change
                </button>
              </div>
            </div>
            
            {/* Script Editor */}
            <ScriptEditor 
              script={script}
              onScriptChange={setScript}
              onMediaAssign={setMediaAnnotations}
              initialAnnotations={mediaAnnotations}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Audio Generation</h2>
              
              {/* Voice Settings */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Voice Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      defaultValue="0"
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">0</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">1.0x</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select
                      defaultValue="neutral"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview Phase */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Preview Phase</h3>
                  <button
                    onClick={generatePreviewAudio}
                    disabled={isGeneratingAudio || audioPreviewSegments.length > 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAudio ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 inline animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2 inline" />
                        Generate First 3 Segments
                      </>
                    )}
                  </button>
                </div>

                {audioPreviewSegments.length > 0 && (
                  <div className="space-y-3">
                    {audioPreviewSegments.map((segment) => (
                      <div key={segment.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Segment {segment.id}</p>
                          <p className="text-xs text-gray-600">{segment.text}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{segment.duration}s</span>
                          <button
                            onClick={() => setCurrentPlayingSegment(segment.id === currentPlayingSegment ? null : segment.id)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            {currentPlayingSegment === segment.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Generation */}
              {audioPreviewSegments.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Full Generation</h3>
                    <button
                      onClick={generateAllAudio}
                      disabled={isGeneratingAudio}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingAudio ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 inline animate-spin" />
                          Generating All...
                        </>
                      ) : (
                        <>
                          <FastForward className="w-4 h-4 mr-2 inline" />
                          Generate All Segments
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      Ready to generate all {audioSegments.length} audio segments with your current voice settings.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Video</h2>
                <p className="text-gray-600 mb-6">Please wait while we create your professional video...</p>
                
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-4 text-center">
                  <div className={`p-3 rounded-lg ${generationProgress >= 25 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Audio Sync</span>
                  </div>
                  <div className={`p-3 rounded-lg ${generationProgress >= 50 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Avatar Render</span>
                  </div>
                  <div className={`p-3 rounded-lg ${generationProgress >= 75 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Media Sync</span>
                  </div>
                  <div className={`p-3 rounded-lg ${generationProgress >= 100 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <Check className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Final Export</span>
                  </div>
                </div>
              </div>
            ) : finalVideo ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Video is Ready!</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800">
                    Your video has been successfully generated and is ready to view.
                  </p>
                </div>
                
                {/* Video Player */}
                <div className="mb-6">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src={finalVideo.thumbnailUrl} 
                      alt={finalVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 shadow-lg transition-transform transform hover:scale-105"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-8 h-8 text-gray-900" />
                        ) : (
                          <Play className="w-8 h-8 text-gray-900" />
                        )}
                      </button>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                          <button className="p-1 hover:text-blue-300 transition-colors">
                            {isVideoPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>
                          <span className="text-sm">{formatDuration(isVideoPlaying ? 45 : 0)} / {formatDuration(finalVideo.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="p-1 hover:text-blue-300 transition-colors">
                            <Volume2 className="w-5 h-5" />
                          </button>
                          <button className="p-1 hover:text-blue-300 transition-colors">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: isVideoPlaying ? '15%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Video Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Video Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium text-gray-900">{finalVideo.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{formatDuration(finalVideo.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avatar:</span>
                        <span className="font-medium text-gray-900">{AVATARS.find(a => a.id === selectedAvatar)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voice:</span>
                        <span className="font-medium text-gray-900">{VOICES.find(v => v.id === selectedVoice)?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Media Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium text-gray-900">1080p HD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium text-gray-900">MP4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">{Math.floor(Math.random() * 100) + 50} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Media Annotations:</span>
                        <span className="font-medium text-gray-900">{mediaAnnotations.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Full Screen
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </button>
                  <button 
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Videos
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ready to Generate</h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-medium text-blue-900 mb-3">Video Summary</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avatar</span>
                        <span className="font-medium text-gray-900">{AVATARS.find(a => a.id === selectedAvatar)?.name}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Voice</span>
                        <span className="font-medium text-gray-900">{VOICES.find(v => v.id === selectedVoice)?.name}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Script Length</span>
                        <span className="font-medium text-gray-900">{script.length} characters</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Media Annotations</span>
                        <span className="font-medium text-gray-900">{mediaAnnotations.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleGenerateVideo}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    <Sparkles className="w-5 h-5 mr-2 inline" />
                    Generate Professional Video
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Automatic Synchronization</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Script narration timing</li>
                      <li>• AI avatar lip-sync</li>
                      <li>• Media transitions</li>
                      <li>• Background elements</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Output Quality</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1080p HD resolution</li>
                      <li>• Professional audio quality</li>
                      <li>• Seamless transitions</li>
                      <li>• Downloadable MP4</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {!finalVideo && (
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Step
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}