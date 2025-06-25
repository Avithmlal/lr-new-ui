import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, FileText, Mic, Video as VideoIcon, Play, Pause, RotateCcw, Download, ChevronRight, ChevronLeft, Eye, Volume2, VolumeX, Sliders, Layers, Film, Sparkles, CheckCircle, AlertCircle, Clock as ClockIcon, Zap, Monitor, User, Headphones, Presentation as PresentationChart, Video, Camera, Loader, Save, FastForward, SkipForward, Upload, Wand2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ScriptEditor } from './ScriptEditor';

// Avatar data for Heygen and Akool
const HEYGEN_AVATARS = [
  { id: 'heygen-sarah', name: 'Sarah - Professional', provider: 'Heygen', style: 'Business Professional', gender: 'Female', thumbnail: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'heygen-mike', name: 'Mike - Casual', provider: 'Heygen', style: 'Casual Presenter', gender: 'Male', thumbnail: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'heygen-emma', name: 'Emma - Educational', provider: 'Heygen', style: 'Educational Expert', gender: 'Female', thumbnail: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'heygen-david', name: 'David - Executive', provider: 'Heygen', style: 'Executive Leader', gender: 'Male', thumbnail: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

const AKOOL_AVATARS = [
  { id: 'akool-lisa', name: 'Lisa - Tech Expert', provider: 'Akool', style: 'Technology Specialist', gender: 'Female', thumbnail: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'akool-james', name: 'James - Creative', provider: 'Akool', style: 'Creative Director', gender: 'Male', thumbnail: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'akool-anna', name: 'Anna - Consultant', provider: 'Akool', style: 'Business Consultant', gender: 'Female', thumbnail: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'akool-robert', name: 'Robert - Trainer', provider: 'Akool', style: 'Corporate Trainer', gender: 'Male', thumbnail: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

const HEYGEN_VOICES = [
  { id: 'heygen-voice-1', name: 'Professional Female', provider: 'Heygen', gender: 'Female', accent: 'American', tone: 'Professional' },
  { id: 'heygen-voice-2', name: 'Confident Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Confident' },
  { id: 'heygen-voice-3', name: 'Warm Female', provider: 'Heygen', gender: 'Female', accent: 'British', tone: 'Warm' },
  { id: 'heygen-voice-4', name: 'Authoritative Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Authoritative' },
];

const AKOOL_VOICES = [
  { id: 'akool-voice-1', name: 'Friendly Female', provider: 'Akool', gender: 'Female', accent: 'American', tone: 'Friendly' },
  { id: 'akool-voice-2', name: 'Dynamic Male', provider: 'Akool', gender: 'Male', accent: 'American', tone: 'Dynamic' },
  { id: 'akool-voice-3', name: 'Elegant Female', provider: 'Akool', gender: 'Female', accent: 'British', tone: 'Elegant' },
  { id: 'akool-voice-4', name: 'Persuasive Male', provider: 'Akool', gender: 'Male', accent: 'Australian', tone: 'Persuasive' },
];

export function VideoEditor({ isOpen, onClose, videoData }) {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [videoModel, setVideoModel] = useState('heygen'); // 'heygen' or 'akool'
  const [videoInfo, setVideoInfo] = useState({
    name: videoData?.name || '',
    projectId: videoData?.projectId || '',
    videoAvatar: '',
    audioAvatar: '',
    script: '',
    mediaAssignments: [],
    audioSegments: [],
    voiceSettings: {
      pitch: 0,
      speed: 1,
      tone: 'neutral'
    },
    compilationProgress: 0,
    isGenerating: false
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewVoice, setPreviewVoice] = useState(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoVolume, setVideoVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scriptEditorRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [showMediaAssignment, setShowMediaAssignment] = useState(false);
  const [audioPreviewSegments, setAudioPreviewSegments] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState(null);
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [hoveredRange, setHoveredRange] = useState(null);

  // Auto-split script into segments
  useEffect(() => {
    if (videoInfo.script) {
      const sentences = videoInfo.script.match(/[^\.!?]+[\.!?]+/g) || [];
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
      
      setVideoInfo(prev => ({ ...prev, audioSegments: segments }));
    }
  }, [videoInfo.script]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text.length > 0) {
      setSelectedText(text);
      
      // Get the range information for highlighting
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      
      // Store the selection range for highlighting
      setShowMediaAssignment(true);
    }
  };

  const assignMedia = (type, content) => {
    if (selectedText) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      // Get the start and end positions in the full text
      const fullText = videoInfo.script;
      const startPos = fullText.indexOf(selectedText);
      const endPos = startPos + selectedText.length;
      
      if (startPos >= 0) {
        const assignment = {
          id: Date.now(),
          text: selectedText,
          type, // 'slide', 'stock-video', 'upload'
          content,
          timestamp: Date.now(),
          range: { start: startPos, end: endPos }
        };
        
        setVideoInfo(prev => ({
          ...prev,
          mediaAssignments: [...prev.mediaAssignments, assignment]
        }));
        
        // Add to highlighted ranges
        setHighlightedRanges(prev => [...prev, { 
          start: startPos, 
          end: endPos, 
          type, 
          content,
          id: assignment.id
        }]);
      }
      
      setShowMediaAssignment(false);
      setSelectedText('');
    }
  };

  const generatePreviewAudio = async () => {
    setIsGeneratingAudio(true);
    const previewSegments = videoInfo.audioSegments.slice(0, 3);
    
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
    const allSegments = [...videoInfo.audioSegments];
    
    // Simulate generating all segments
    for (let i = 0; i < allSegments.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      allSegments[i] = {
        ...allSegments[i],
        audioUrl: `#audio-${allSegments[i].id}`,
        isGenerated: true,
        duration: Math.floor(Math.random() * 10) + 5
      };
      
      setVideoInfo(prev => ({ ...prev, audioSegments: [...allSegments] }));
    }
    
    setIsGeneratingAudio(false);
  };

  const startVideoCompilation = async () => {
    setVideoInfo(prev => ({ ...prev, isGenerating: true, compilationProgress: 0 }));
    
    // Simulate compilation progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setVideoInfo(prev => ({ ...prev, compilationProgress: i }));
    }
    
    // Create final video
    const finalVideo = {
      id: Date.now().toString(),
      title: videoInfo.name,
      description: 'Professional AI-generated video with avatar and voice synthesis',
      type: 'professional',
      projectId: state.projects[0]?.id || '1',
      projectTitle: state.projects[0]?.title || 'Professional Videos',
      status: 'completed',
      duration: videoInfo.audioSegments.reduce((acc, seg) => acc + seg.duration, 0),
      thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://example.com/video.mp4', // Mock URL
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      creator: {
        name: 'Current User',
        email: 'user@example.com',
        avatar: videoInfo.videoAvatar
      },
      metadata: {
        resolution: '1080p',
        format: 'mp4',
        size: '125.4 MB',
        avatar: videoInfo.videoAvatar,
        voice: videoInfo.audioAvatar,
        language: 'English',
        style: 'professional',
        includeSubtitles: true,
        backgroundMusic: false,
        mediaAssignments: videoInfo.mediaAssignments.length,
        audioSegments: videoInfo.audioSegments.length
      }
    };
    
    dispatch({ type: 'ADD_VIDEO', payload: finalVideo });
    
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Professional Video Created',
        message: `"${videoInfo.name}" has been successfully generated with AI avatar and voice synthesis.`,
        timestamp: new Date(),
        isRead: false,
      }
    });
    
    setVideoInfo(prev => ({ ...prev, isGenerating: false }));
    setShowFinalVideo(true);
  };

  // Function to render the script with highlighted sections
  const renderHighlightedScript = () => {
    if (!videoInfo.script) return null;
    
    // Sort ranges by start position to ensure proper rendering
    const sortedRanges = [...highlightedRanges].sort((a, b) => a.start - b.start);
    
    const result = [];
    let lastEnd = 0;
    
    sortedRanges.forEach((range, index) => {
      // Add text before this range
      if (range.start > lastEnd) {
        result.push(
          <span key={`text-${index}`} className="text-gray-900">
            {videoInfo.script.substring(lastEnd, range.start)}
          </span>
        );
      }
      
      // Add the highlighted range
      result.push(
        <span 
          key={`highlight-${range.id}`}
          className={`${getHighlightColor(range.type)} cursor-pointer relative`}
          onMouseEnter={() => setHoveredRange(range)}
          onMouseLeave={() => setHoveredRange(null)}
        >
          {videoInfo.script.substring(range.start, range.end)}
          
          {/* Tooltip that appears on hover */}
          {hoveredRange && hoveredRange.id === range.id && (
            <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs text-gray-700 w-48 -top-12 left-1/2 transform -translate-x-1/2">
              <div className="font-medium mb-1 capitalize">{range.type.replace('-', ' ')}</div>
              <div className="text-gray-600 truncate">{range.content}</div>
            </div>
          )}
        </span>
      );
      
      lastEnd = range.end;
    });
    
    // Add any remaining text
    if (lastEnd < videoInfo.script.length) {
      result.push(
        <span key="text-end" className="text-gray-900">
          {videoInfo.script.substring(lastEnd)}
        </span>
      );
    }
    
    return result;
  };
  
  // Function to get highlight color based on media type
  const getHighlightColor = (type) => {
    switch (type) {
      case 'slide': return 'bg-blue-100 text-blue-800';
      case 'stock-video': return 'bg-purple-100 text-purple-800';
      case 'upload': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle avatar preview
  const handleAvatarPreview = (avatar) => {
    setPreviewAvatar(avatar);
  };

  // Handle voice preview
  const handleVoicePreview = (voice) => {
    setPreviewVoice(voice);
    setIsPlayingVoice(true);
    
    // Simulate voice playback ending after 3 seconds
    setTimeout(() => {
      setIsPlayingVoice(false);
    }, 3000);
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setVideoInfo(prev => ({ ...prev, videoAvatar: avatar.id }));
    setPreviewAvatar(null);
  };

  // Handle voice selection
  const handleVoiceSelect = (voice) => {
    setVideoInfo(prev => ({ ...prev, audioAvatar: voice.id }));
    setPreviewVoice(null);
  };

  // Toggle video playback
  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Update video progress (simulated)
  useEffect(() => {
    let interval;
    if (isVideoPlaying && showFinalVideo) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 300);
    }
    
    return () => clearInterval(interval);
  }, [isVideoPlaying, showFinalVideo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create Professional Video</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {showFinalVideo ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Video is Ready!</h3>
              
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                  {/* Video Thumbnail/Preview */}
                  <img 
                    src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1280" 
                    alt="Video preview"
                    className={`w-full h-full object-cover ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                  />
                  
                  {/* Play Button Overlay */}
                  {!isVideoPlaying && (
                    <button
                      onClick={toggleVideoPlay}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-30 transition-all"
                    >
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-900 ml-1" />
                      </div>
                    </button>
                  )}
                  
                  {/* Video Player Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex flex-col space-y-2">
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-600 rounded-full h-1 cursor-pointer">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${videoProgress}%` }}
                        ></div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={toggleVideoPlay}
                            className="text-white hover:text-blue-300 transition-colors"
                          >
                            {isVideoPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={toggleMute}
                              className="text-white hover:text-blue-300 transition-colors"
                            >
                              {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>
                            
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isMuted ? 0 : videoVolume}
                              onChange={(e) => {
                                setVideoVolume(parseInt(e.target.value));
                                if (parseInt(e.target.value) === 0) {
                                  setIsMuted(true);
                                } else {
                                  setIsMuted(false);
                                }
                              }}
                              className="w-20 h-1 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                          </div>
                          
                          <span className="text-white text-xs">
                            {Math.floor(videoProgress / 100 * 120)}s / 120s
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-blue-300 transition-colors"
                          >
                            <Maximize className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{videoInfo.name}</h3>
                  <p className="text-gray-600 mb-4">
                    Professional AI-generated video with {videoInfo.videoAvatar} avatar and {videoInfo.audioAvatar} voice.
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>2:00</span>
                    </div>
                    <div className="flex items-center">
                      <Film className="w-4 h-4 mr-1" />
                      <span>1080p</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span>125.4 MB</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share className="w-4 h-4 mr-2 inline" />
                      Share
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Edit
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Video Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Resolution:</span>
                      <span className="font-medium">1080p</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">MP4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">125.4 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avatar:</span>
                      <span className="font-medium">{videoInfo.videoAvatar.split('-').pop()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Voice:</span>
                      <span className="font-medium">{videoInfo.audioAvatar.split('-').pop()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Media Annotations:</span>
                      <span className="font-medium">{videoInfo.mediaAssignments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select AI Model</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      onClick={() => setVideoModel('heygen')}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        videoModel === 'heygen'
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Video className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Heygen</h4>
                          <p className="text-sm text-gray-600">Professional AI avatars</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4">High-quality AI avatars with natural expressions and professional appearance.</p>
                      
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Realistic facial expressions
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Professional appearance
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Natural voice synthesis
                        </li>
                      </ul>
                    </div>

                    <div
                      onClick={() => setVideoModel('akool')}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        videoModel === 'akool'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <Video className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Akool</h4>
                          <p className="text-sm text-gray-600">Versatile AI avatars</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4">Versatile AI avatars with a wide range of styles and customization options.</p>
                      
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                          Multiple avatar styles
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                          Customizable expressions
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                          Diverse voice options
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Avatar and Voice</h3>
                  
                  {/* Video Avatar Selection */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <VideoIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Choose Video Avatar
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {(videoModel === 'heygen' ? HEYGEN_AVATARS : AKOOL_AVATARS).map((avatar) => (
                        <div
                          key={avatar.id}
                          className={`relative flex items-center p-3 border-2 rounded-lg transition-all group ${
                            videoInfo.videoAvatar === avatar.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={avatar.thumbnail}
                            alt={avatar.name}
                            className="w-16 h-16 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{avatar.name}</p>
                            <p className="text-sm text-gray-600">{avatar.style}</p>
                          </div>
                          
                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAvatarPreview(avatar);
                                }}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                              >
                                <Eye className="w-4 h-4 text-gray-700" />
                              </button>
                              <button
                                onClick={() => handleAvatarSelect(avatar)}
                                className="p-2 bg-blue-600 rounded-full shadow-md hover:bg-blue-700"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio Avatar Selection */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <Headphones className="w-5 h-5 mr-2 text-green-600" />
                      Choose Audio Voice
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {(videoModel === 'heygen' ? HEYGEN_VOICES : AKOOL_VOICES).map((voice) => (
                        <div
                          key={voice.id}
                          className={`relative p-3 border-2 rounded-lg transition-all group ${
                            videoInfo.audioAvatar === voice.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{voice.name}</p>
                              <p className="text-sm text-gray-600">{voice.accent} • {voice.tone}</p>
                            </div>
                          </div>
                          
                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVoicePreview(voice);
                                }}
                                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                              >
                                {isPlayingVoice && previewVoice?.id === voice.id ? (
                                  <Pause className="w-4 h-4 text-gray-700" />
                                ) : (
                                  <Play className="w-4 h-4 text-gray-700" />
                                )}
                              </button>
                              <button
                                onClick={() => handleVoiceSelect(voice)}
                                className="p-2 bg-green-600 rounded-full shadow-md hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between space-x-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={!videoInfo.videoAvatar || !videoInfo.audioAvatar}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Script Editor</h3>
                  
                  <ScriptEditor
                    script={videoInfo.script}
                    onScriptChange={(newScript) => setVideoInfo(prev => ({ ...prev, script: newScript }))}
                    onMediaAssign={(annotations) => {
                      // Transform annotations to mediaAssignments format
                      const mediaAssignments = annotations.map(annotation => ({
                        id: annotation.id,
                        text: annotation.text,
                        type: annotation.type,
                        content: annotation.content,
                        timestamp: Date.now(),
                        range: annotation.range
                      }));
                      
                      setVideoInfo(prev => ({ ...prev, mediaAssignments: mediaAssignments }));
                      setHighlightedRanges(annotations.map(a => ({
                        id: a.id,
                        start: a.range.start,
                        end: a.range.end,
                        type: a.type,
                        content: a.content
                      })));
                    }}
                    initialAnnotations={highlightedRanges.map(r => ({
                      id: r.id,
                      text: videoInfo.script.substring(r.start, r.end),
                      type: r.type,
                      content: r.content,
                      range: { start: r.start, end: r.end }
                    }))}
                  />

                  <div className="flex justify-between space-x-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        disabled={!videoInfo.script.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Generation</h3>
                  
                  {/* Voice Settings */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Voice Settings</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={videoInfo.voiceSettings.pitch}
                          onChange={(e) => setVideoInfo(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, pitch: parseInt(e.target.value) }
                          }))}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{videoInfo.voiceSettings.pitch}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={videoInfo.voiceSettings.speed}
                          onChange={(e) => setVideoInfo(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, speed: parseFloat(e.target.value) }
                          }))}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{videoInfo.voiceSettings.speed}x</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                        <select
                          value={videoInfo.voiceSettings.tone}
                          onChange={(e) => setVideoInfo(prev => ({
                            ...prev,
                            voiceSettings: { ...prev.voiceSettings, tone: e.target.value }
                          }))}
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
                      <h4 className="font-medium text-gray-900">Preview Phase</h4>
                      <button
                        onClick={generatePreviewAudio}
                        disabled={isGeneratingAudio || audioPreviewSegments.length > 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingAudio ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin inline" />
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
                                onClick={() => setCurrentPlayingSegment(segment.id)}
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
                        <h4 className="font-medium text-gray-900">Full Generation</h4>
                        <button
                          onClick={generateAllAudio}
                          disabled={isGeneratingAudio}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingAudio ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin inline" />
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
                          Ready to generate all {videoInfo.audioSegments.length} audio segments with your current voice settings.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setCurrentStep(5)}
                        disabled={videoInfo.audioSegments.length === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Compilation</h3>
                  
                  {!videoInfo.isGenerating ? (
                    <div className="space-y-6">
                      {/* Compilation Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="font-medium text-blue-900 mb-3">Ready for Compilation</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Audio Segments</span>
                              <span className="font-medium text-gray-900">{videoInfo.audioSegments.length}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Media Assignments</span>
                              <span className="font-medium text-gray-900">{videoInfo.mediaAssignments.length}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Video Avatar</span>
                              <span className="font-medium text-gray-900">Selected</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Audio Avatar</span>
                              <span className="font-medium text-gray-900">Selected</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={startVideoCompilation}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                          <Sparkles className="w-5 h-5 mr-2 inline" />
                          Start Video Compilation
                        </button>
                      </div>

                      {/* Compilation Features */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Automatic Synchronization</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Script narration timing</li>
                            <li>• AI avatar lip-sync</li>
                            <li>• Media transitions</li>
                            <li>• Background elements</li>
                          </ul>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Output Quality</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 1080p HD resolution</li>
                            <li>• Professional audio quality</li>
                            <li>• Seamless transitions</li>
                            <li>• Downloadable MP4</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Compiling Your Video</h4>
                      <p className="text-gray-600 mb-6">AI is synchronizing your avatar, voice, and media...</p>
                      
                      <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{videoInfo.compilationProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${videoInfo.compilationProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-4 gap-4 text-center">
                        <div className={`p-3 rounded-lg ${videoInfo.compilationProgress >= 25 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                          <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Audio Sync</span>
                        </div>
                        <div className={`p-3 rounded-lg ${videoInfo.compilationProgress >= 50 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                          <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Avatar Render</span>
                        </div>
                        <div className={`p-3 rounded-lg ${videoInfo.compilationProgress >= 75 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                          <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Media Sync</span>
                        </div>
                        <div className={`p-3 rounded-lg ${videoInfo.compilationProgress >= 100 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                          <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Final Export</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      disabled={videoInfo.isGenerating}
                    >
                      Back
                    </button>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={videoInfo.isGenerating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {previewAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{previewAvatar.name}</h3>
              <button
                onClick={() => setPreviewAvatar(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img 
                  src={previewAvatar.thumbnail.replace('w=150', 'w=400')} 
                  alt={previewAvatar.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              
              <div className="md:w-1/2 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Provider</h4>
                  <p className="text-gray-900">{previewAvatar.provider}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Style</h4>
                  <p className="text-gray-900">{previewAvatar.style}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Gender</h4>
                  <p className="text-gray-900">{previewAvatar.gender}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Best For</h4>
                  <p className="text-gray-900">
                    {previewAvatar.provider === 'Heygen' 
                      ? 'Professional presentations, corporate training, and formal educational content'
                      : 'Creative content, casual presentations, and engaging educational videos'}
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleAvatarSelect(previewAvatar);
                      setPreviewAvatar(null);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Select This Avatar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}