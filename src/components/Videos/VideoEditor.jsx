import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, FileText, Mic, Video as VideoIcon, Play, Pause, RotateCcw, Download, ChevronRight, ChevronLeft, Eye, Volume2, VolumeX, Sliders, Layers, Film, Sparkles, CheckCircle, AlertCircle, Clock as ClockIcon, Zap, Monitor, User, Headphones, Presentation as PresentationChart, Video, Camera, Loader, Save, FastForward, SkipForward, Upload, Wand2, Edit2, Check } from 'lucide-react';
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
    isGenerating: false,
    createPreview: true,
    previewDuration: 10
  });

  const [selectedText, setSelectedText] = useState('');
  const [showMediaAssignment, setShowMediaAssignment] = useState(false);
  const [audioPreviewSegments, setAudioPreviewSegments] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState(null);
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [hoveredRange, setHoveredRange] = useState(null);
  const [showAllSegments, setShowAllSegments] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [showPreviewOptions, setShowPreviewOptions] = useState(false);

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

  const generatePreviewVideo = async () => {
    setIsGeneratingAudio(true);
    
    // Simulate preview video generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Preview Video Generated',
        message: `A ${videoInfo.previewDuration}-second preview video has been created. You can now proceed with full video generation.`,
        timestamp: new Date(),
        isRead: false,
      }
    });
    
    setIsGeneratingAudio(false);
    setShowPreviewOptions(false);
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
    onClose();
  };

  // Function to handle editing a segment
  const handleEditSegment = (segment) => {
    setEditingSegment(segment);
    setEditedText(segment.text);
  };

  // Function to save edited segment
  const saveEditedSegment = () => {
    if (!editingSegment) return;
    
    const updatedSegments = videoInfo.audioSegments.map(segment => 
      segment.id === editingSegment.id 
        ? { ...segment, text: editedText, isGenerated: false, audioUrl: null } 
        : segment
    );
    
    setVideoInfo(prev => ({ ...prev, audioSegments: updatedSegments }));
    setEditingSegment(null);
    setEditedText('');
  };

  // Function to regenerate a specific segment
  const regenerateSegment = async (segment) => {
    setIsGeneratingAudio(true);
    
    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedSegments = videoInfo.audioSegments.map(s => 
      s.id === segment.id 
        ? { 
            ...s, 
            audioUrl: `#audio-${s.id}-regenerated`, 
            isGenerated: true, 
            duration: Math.floor(Math.random() * 10) + 5 
          } 
        : s
    );
    
    setVideoInfo(prev => ({ ...prev, audioSegments: updatedSegments }));
    setIsGeneratingAudio(false);
    
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Segment Regenerated',
        message: `Audio segment ${segment.id} has been regenerated successfully.`,
        timestamp: new Date(),
        isRead: false,
      }
    });
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
                      onClick={() => setVideoInfo(prev => ({ ...prev, videoAvatar: avatar.id }))}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                      <div className="ml-auto">
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Preview avatar functionality would go here
                            dispatch({
                              type: 'ADD_SYSTEM_MESSAGE',
                              payload: {
                                id: Date.now().toString(),
                                type: 'info',
                                title: 'Avatar Preview',
                                message: `Previewing ${avatar.name}...`,
                                timestamp: new Date(),
                                isRead: false,
                              }
                            });
                          }}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
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
                      onClick={() => setVideoInfo(prev => ({ ...prev, audioAvatar: voice.id }))}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                        <button 
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Play voice sample
                            dispatch({
                              type: 'ADD_SYSTEM_MESSAGE',
                              payload: {
                                id: Date.now().toString(),
                                type: 'info',
                                title: 'Voice Preview',
                                message: `Playing sample of ${voice.name}...`,
                                timestamp: new Date(),
                                isRead: false,
                              }
                            });
                          }}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
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
                  // Update highlighted ranges based on annotations
                  const newRanges = annotations.map(annotation => ({
                    id: annotation.id,
                    start: annotation.range.start,
                    end: annotation.range.end,
                    type: annotation.type,
                    content: annotation.content
                  }));
                  
                  setHighlightedRanges(newRanges);
                  setVideoInfo(prev => ({ ...prev, mediaAssignments: annotations }));
                }}
                initialAnnotations={videoInfo.mediaAssignments}
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
                          {editingSegment?.id === segment.id ? (
                            <div className="flex flex-col space-y-2">
                              <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                rows={3}
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingSegment(null)}
                                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={saveEditedSegment}
                                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                  <Check className="w-3 h-3 mr-1 inline" />
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-gray-900">Segment {segment.id}</p>
                              <p className="text-xs text-gray-600">{segment.text}</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
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
                          <button
                            onClick={() => handleEditSegment(segment)}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => regenerateSegment(segment)}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                          >
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
                    <h4 className="font-medium text-gray-900">Full Audio Generation</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAllSegments(!showAllSegments)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        {showAllSegments ? 'Hide All Segments' : 'Show All Segments'}
                      </button>
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
                  </div>

                  {showAllSegments && (
                    <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto">
                      {videoInfo.audioSegments.map((segment) => (
                        <div key={segment.id} className={`flex items-center p-3 rounded-lg ${segment.isGenerated ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <div className="flex-1">
                            {editingSegment?.id === segment.id ? (
                              <div className="flex flex-col space-y-2">
                                <textarea
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  rows={3}
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setEditingSegment(null)}
                                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={saveEditedSegment}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                  >
                                    <Check className="w-3 h-3 mr-1 inline" />
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-gray-900">Segment {segment.id}</p>
                                <p className="text-xs text-gray-600">{segment.text}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {segment.isGenerated && (
                              <>
                                <span className="text-xs text-gray-500">{segment.duration}s</span>
                                <button
                                  onClick={() => setCurrentPlayingSegment(segment.id === currentPlayingSegment ? null : segment.id)}
                                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  disabled={!segment.isGenerated}
                                >
                                  {currentPlayingSegment === segment.id ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditSegment(segment)}
                              className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {segment.isGenerated && (
                              <button 
                                onClick={() => regenerateSegment(segment)}
                                className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showAllSegments && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        Ready to generate all {videoInfo.audioSegments.length} audio segments with your current voice settings.
                      </p>
                    </div>
                  )}
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
                  {/* Preview Video Option */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-medium text-blue-900 mb-3">Preview Video</h4>
                    <p className="text-sm text-blue-800 mb-4">
                      Create a short preview video to check how your avatar and voice will look before generating the full video.
                    </p>
                    
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="create-preview"
                        checked={videoInfo.createPreview}
                        onChange={(e) => setVideoInfo(prev => ({ ...prev, createPreview: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="create-preview" className="ml-2 text-sm text-blue-800">
                        Create a preview video first
                      </label>
                    </div>
                    
                    {videoInfo.createPreview && (
                      <div className="flex items-end space-x-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-1">
                            Preview Duration (seconds)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="30"
                            value={videoInfo.previewDuration}
                            onChange={(e) => setVideoInfo(prev => ({ ...prev, previewDuration: parseInt(e.target.value) }))}
                            className="w-24 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        
                        <button
                          onClick={() => setShowPreviewOptions(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2 inline" />
                          Generate Preview
                        </button>
                      </div>
                    )}
                  </div>

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
        </div>
      </div>

      {/* Preview Video Generation Modal */}
      {showPreviewOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Preview Video</h3>
            <p className="text-gray-600 mb-4">
              This will create a {videoInfo.previewDuration}-second preview video using your selected avatar and voice settings.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <VideoIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Preview Video Settings</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Duration:</span>
                  <span className="text-sm font-medium text-blue-900">{videoInfo.previewDuration} seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Avatar:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {(videoModel === 'heygen' ? HEYGEN_AVATARS : AKOOL_AVATARS).find(a => a.id === videoInfo.videoAvatar)?.name || 'Selected Avatar'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">Voice:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {(videoModel === 'heygen' ? HEYGEN_VOICES : AKOOL_VOICES).find(v => v.id === videoInfo.audioAvatar)?.name || 'Selected Voice'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPreviewOptions(false);
                  setVideoInfo(prev => ({ ...prev, createPreview: false }));
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Skip Preview
              </button>
              <button
                onClick={generatePreviewVideo}
                disabled={isGeneratingAudio}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingAudio ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2 inline" />
                    Generate Preview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}