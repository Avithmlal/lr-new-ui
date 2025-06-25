import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Settings, FileText, Mic, Video as VideoIcon, Play, Pause, RotateCcw, Download, ChevronRight, ChevronLeft, Eye, Volume2, VolumeX, Sliders, Layers, Film, Sparkles, CheckCircle, AlertCircle, Clock as ClockIcon, Zap, Monitor, User, Headphones, Presentation as PresentationChart, Video, Camera, Loader, Save, FastForward, SkipForward, Upload, Wand2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

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

export function VideoEditorPage() {
  const { videoId } = useParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [videoModel, setVideoModel] = useState('heygen'); // 'heygen' or 'akool'
  const [videoInfo, setVideoInfo] = useState({
    name: '',
    projectId: '',
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
    isGenerating: false,
    pptSlides: []
  });

  // Find the video in state
  useEffect(() => {
    if (videoId) {
      const video = state.videos.find(v => v.id === videoId);
      if (video) {
        setVideoInfo(prev => ({
          ...prev,
          name: video.title,
          projectId: video.projectId
        }));
      } else {
        // Video not found, redirect to videos page
        navigate('/videos');
        dispatch({
          type: 'ADD_SYSTEM_MESSAGE',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            title: 'Video Not Found',
            message: 'The requested video could not be found.',
            timestamp: new Date(),
            isRead: false,
          }
        });
      }
    }
  }, [videoId, state.videos, navigate, dispatch]);

  const scriptEditorRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [mediaTooltipPosition, setMediaTooltipPosition] = useState({ x: 0, y: 0 });
  const [showMediaTooltip, setShowMediaTooltip] = useState(false);
  const [audioPreviewSegments, setAudioPreviewSegments] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState(null);
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [hoveredRange, setHoveredRange] = useState(null);
  const [showPptUploadModal, setShowPptUploadModal] = useState(false);

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
      
      // Calculate position for the tooltip
      const rect = range.getBoundingClientRect();
      const editorRect = scriptEditorRef.current.getBoundingClientRect();
      
      setMediaTooltipPosition({
        x: rect.left + rect.width / 2 - editorRect.left,
        y: rect.top - editorRect.top - 40 // Position above the selected text
      });
      
      setShowMediaTooltip(true);
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
      
      setShowMediaTooltip(false);
      setSelectedText('');
    }
  };

  const handleUploadPpt = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate PPT upload and slide extraction
      const mockSlides = [
        { id: 1, title: 'Slide 1: Introduction', thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: 2, title: 'Slide 2: Key Points', thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: 3, title: 'Slide 3: Data Analysis', thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: 4, title: 'Slide 4: Results', thumbnail: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150' },
        { id: 5, title: 'Slide 5: Conclusion', thumbnail: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150' },
      ];
      
      setVideoInfo(prev => ({ ...prev, pptSlides: mockSlides }));
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'PowerPoint Uploaded',
          message: `Successfully extracted ${mockSlides.length} slides from "${file.name}"`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const assignSlide = (slideId) => {
    if (selectedText) {
      const slide = videoInfo.pptSlides.find(s => s.id === slideId);
      if (slide) {
        assignMedia('slide', `Slide ${slide.id}: ${slide.title}`);
      }
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
      id: videoId || Date.now().toString(),
      title: videoInfo.name,
      description: 'Professional AI-generated video with avatar and voice synthesis',
      type: 'professional',
      projectId: videoInfo.projectId || state.projects[0]?.id || '1',
      projectTitle: videoInfo.projectId 
        ? state.projects.find(p => p.id === videoInfo.projectId)?.title 
        : state.projects[0]?.title || 'Professional Videos',
      status: 'completed',
      duration: videoInfo.audioSegments.reduce((acc, seg) => acc + (seg.duration || 0), 0),
      thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: '#professional-video',
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
    
    // Update or add the video
    if (videoId) {
      dispatch({ type: 'UPDATE_VIDEO', payload: finalVideo });
    } else {
      dispatch({ type: 'ADD_VIDEO', payload: finalVideo });
    }
    
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
    navigate('/videos');
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

  // Get selected avatar and voice info
  const selectedAvatar = videoInfo.videoAvatar 
    ? [...HEYGEN_AVATARS, ...AKOOL_AVATARS].find(a => a.id === videoInfo.videoAvatar)
    : null;
    
  const selectedVoice = videoInfo.audioAvatar
    ? [...HEYGEN_VOICES, ...AKOOL_VOICES].find(v => v.id === videoInfo.audioAvatar)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/videos')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{videoInfo.name || 'New Video'}</h1>
                <p className="text-sm text-gray-600">
                  {currentStep === 1 ? 'Select AI Model' : 
                   currentStep === 2 ? 'Choose Avatar & Voice' :
                   currentStep === 3 ? 'Script Editor' :
                   currentStep === 4 ? 'Audio Generation' :
                   'Video Compilation'}
                </p>
              </div>
            </div>
            
            {/* Selected Avatar & Voice */}
            {(selectedAvatar || selectedVoice) && (
              <div className="flex items-center space-x-4">
                {selectedAvatar && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={selectedAvatar.thumbnail} 
                        alt={selectedAvatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{selectedAvatar.name}</span>
                  </div>
                )}
                
                {selectedVoice && (
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Volume2 className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">{selectedVoice.name}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Steps */}
            <div className="hidden md:flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(step => (
                <div 
                  key={step}
                  className={`flex items-center ${step < 5 ? 'mr-2' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step < currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-3 h-3" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-8 h-0.5 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Select AI Model</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => navigate('/videos')}
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
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Avatar and Voice</h3>
            
            {/* Video Avatar Selection */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <VideoIcon className="w-5 h-5 mr-2 text-blue-600" />
                Choose Video Avatar
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(videoModel === 'heygen' ? HEYGEN_AVATARS : AKOOL_AVATARS).map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => setVideoInfo(prev => ({ ...prev, videoAvatar: avatar.id }))}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      videoInfo.videoAvatar === avatar.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={avatar.thumbnail}
                      alt={avatar.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{avatar.name}</p>
                      <p className="text-sm text-gray-600">{avatar.style}</p>
                      <p className="text-xs text-gray-500 mt-1">{avatar.gender} • {avatar.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Avatar Selection */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Headphones className="w-5 h-5 mr-2 text-green-600" />
                Choose Audio Voice
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(videoModel === 'heygen' ? HEYGEN_VOICES : AKOOL_VOICES).map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => setVideoInfo(prev => ({ ...prev, audioAvatar: voice.id }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      videoInfo.audioAvatar === voice.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{voice.name}</p>
                        <p className="text-sm text-gray-600">{voice.accent} • {voice.tone}</p>
                        <p className="text-xs text-gray-500 mt-1">{voice.gender} • {voice.provider}</p>
                      </div>
                      <Volume2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between space-x-3 mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/videos')}
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
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Script Editor</h3>
              
              {/* PPT Upload Button */}
              <div>
                <input
                  type="file"
                  id="ppt-upload"
                  accept=".ppt,.pptx"
                  className="hidden"
                  onChange={handleUploadPpt}
                />
                <label
                  htmlFor="ppt-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <PresentationChart className="w-4 h-4 mr-2" />
                  Upload PowerPoint
                </label>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Script Editor - 2/3 width */}
              <div className="md:w-2/3">
                <div className="relative">
                  <textarea
                    ref={scriptEditorRef}
                    value={videoInfo.script}
                    onChange={(e) => setVideoInfo(prev => ({ ...prev, script: e.target.value }))}
                    onMouseUp={handleTextSelection}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Type or paste your script here. Highlight text to assign media..."
                  />
                  
                  {/* Overlay for highlighted text */}
                  {videoInfo.script && highlightedRanges.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none px-4 py-3 font-mono text-sm">
                      <div className="relative">
                        {renderHighlightedScript()}
                      </div>
                    </div>
                  )}
                  
                  {/* Media Assignment Tooltip */}
                  {showMediaTooltip && selectedText && (
                    <div 
                      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10"
                      style={{ 
                        left: `${mediaTooltipPosition.x}px`, 
                        top: `${mediaTooltipPosition.y}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="flex space-x-2">
                        <button
                          onClick={() => assignMedia('slide', 'PowerPoint slide')}
                          className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          title="Assign PowerPoint Slide"
                        >
                          <PresentationChart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => assignMedia('stock-video', 'Stock video footage')}
                          className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                          title="Assign Stock Video"
                        >
                          <VideoIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => assignMedia('upload', 'Custom upload')}
                          className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          title="Upload Custom Media"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Highlight text to assign media elements. Assigned sections will be highlighted.
                </p>
                
                {/* Media Assignments Summary */}
                {videoInfo.mediaAssignments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Media Assignments</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Total Assignments</span>
                        <span className="text-sm font-medium text-gray-900">{videoInfo.mediaAssignments.length}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
                          <span>Slides: {videoInfo.mediaAssignments.filter(a => a.type === 'slide').length}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <div className="w-3 h-3 bg-purple-100 rounded-full"></div>
                          <span>Videos: {videoInfo.mediaAssignments.filter(a => a.type === 'stock-video').length}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                          <span>Uploads: {videoInfo.mediaAssignments.filter(a => a.type === 'upload').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Sidebar - 1/3 width */}
              <div className="md:w-1/3">
                {/* PPT Slides Panel */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">PowerPoint Slides</h4>
                  
                  {videoInfo.pptSlides.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <PresentationChart className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No PowerPoint uploaded</p>
                      <p className="text-xs text-gray-500 mt-1">Upload a PPT to assign slides to your script</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {videoInfo.pptSlides.map(slide => (
                        <div 
                          key={slide.id}
                          onClick={() => assignSlide(slide.id)}
                          className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                        >
                          <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={slide.thumbnail} 
                              alt={slide.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{slide.title}</p>
                            <p className="text-xs text-gray-500">Click to assign to selected text</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Media Assignment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Media Assignment</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Highlight text in your script to assign media:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center mr-2 mt-0.5">
                        <PresentationChart className="w-2 h-2 text-blue-700" />
                      </div>
                      <span>Assign PowerPoint slides to specific parts of your script</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center mr-2 mt-0.5">
                        <VideoIcon className="w-2 h-2 text-purple-700" />
                      </div>
                      <span>Add stock video footage for visual enhancement</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center mr-2 mt-0.5">
                        <Upload className="w-2 h-2 text-green-700" />
                      </div>
                      <span>Upload custom media for specific sections</span>
                    </li>
                  </ul>
                </div>
                
                {/* Script Segments Preview */}
                {videoInfo.audioSegments.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Script Segments ({videoInfo.audioSegments.length})
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {videoInfo.audioSegments.slice(0, 3).map((segment) => (
                        <div key={segment.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Segment {segment.id}</span>
                            <span className="text-xs text-gray-500">~{Math.ceil(segment.text.length / 10)}s</span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{segment.text}</p>
                        </div>
                      ))}
                      {videoInfo.audioSegments.length > 3 && (
                        <div className="text-center text-xs text-blue-600 font-medium">
                          +{videoInfo.audioSegments.length - 3} more segments
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between space-x-3 mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/videos')}
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
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Audio Generation</h3>
            
            {/* Voice Settings */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Voice Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Lower</span>
                    <span>{videoInfo.voiceSettings.pitch}</span>
                    <span>Higher</span>
                  </div>
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
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Slower</span>
                    <span>{videoInfo.voiceSettings.speed}x</span>
                    <span>Faster</span>
                  </div>
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
                  disabled={isGeneratingAudio || audioPreviewSegments.length > 0 || videoInfo.audioSegments.length === 0}
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

              {audioPreviewSegments.length > 0 ? (
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
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <Wand2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Generate audio preview</p>
                  <p className="text-xs text-gray-500 mt-1">Test your voice settings with the first few segments</p>
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

            <div className="flex justify-between space-x-3 mt-8">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/videos')}
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
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Video Compilation</h3>
            
            {!videoInfo.isGenerating ? (
              <div className="space-y-6">
                {/* Compilation Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-3">Ready for Compilation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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

            <div className="flex justify-between space-x-3 mt-8">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={videoInfo.isGenerating}
              >
                Back
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/videos')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={videoInfo.isGenerating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}