import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  FileText, 
  Mic, 
  Video as VideoIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Layers, 
  Film, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Clock as ClockIcon, 
  Zap, 
  Monitor, 
  User, 
  Headphones, 
  Presentation as PresentationChart, 
  Video, 
  Camera, 
  Loader, 
  Save, 
  FastForward, 
  SkipForward, 
  Upload, 
  Wand2,
  ChevronDown,
  ChevronUp,
  Edit,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  { id: 'heygen-voice-1', name: 'Professional Female', provider: 'Heygen', gender: 'Female', accent: 'American', tone: 'Professional', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3' },
  { id: 'heygen-voice-2', name: 'Confident Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Confident', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-614.mp3' },
  { id: 'heygen-voice-3', name: 'Warm Female', provider: 'Heygen', gender: 'Female', accent: 'British', tone: 'Warm', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3' },
  { id: 'heygen-voice-4', name: 'Authoritative Male', provider: 'Heygen', gender: 'Male', accent: 'American', tone: 'Authoritative', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3' },
];

const AKOOL_VOICES = [
  { id: 'akool-voice-1', name: 'Friendly Female', provider: 'Akool', gender: 'Female', accent: 'American', tone: 'Friendly', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3' },
  { id: 'akool-voice-2', name: 'Dynamic Male', provider: 'Akool', gender: 'Male', accent: 'American', tone: 'Dynamic', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3' },
  { id: 'akool-voice-3', name: 'Elegant Female', provider: 'Akool', gender: 'Female', accent: 'British', tone: 'Elegant', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3' },
  { id: 'akool-voice-4', name: 'Persuasive Male', provider: 'Akool', gender: 'Male', accent: 'Australian', tone: 'Persuasive', sampleUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3' },
];

export function VideoEditor({ videoData }) {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [videoModel, setVideoModel] = useState('heygen'); // 'heygen' or 'akool'
  const [videoInfo, setVideoInfo] = useState({
    name: videoData?.title || '',
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

  const [selectedText, setSelectedText] = useState('');
  const [showMediaAssignment, setShowMediaAssignment] = useState(false);
  const [audioPreviewSegments, setAudioPreviewSegments] = useState([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState(null);
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [hoveredRange, setHoveredRange] = useState(null);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [showVoicePreview, setShowVoicePreview] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentVoicePreview, setCurrentVoicePreview] = useState(null);
  const [showCombinedAudio, setShowCombinedAudio] = useState(true);
  const [editingSegmentId, setEditingSegmentId] = useState(null);
  const [editingSegmentText, setEditingSegmentText] = useState('');
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-working-on-a-laptop-in-a-meeting-room-32493-large.mp4');

  const audioRef = useRef(null);
  const videoRef = useRef(null);

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

  const handleMediaAssign = (annotations) => {
    setVideoInfo(prev => ({
      ...prev,
      mediaAssignments: annotations
    }));
    setHighlightedRanges(annotations.map(a => ({
      start: a.range.start,
      end: a.range.end,
      type: a.type,
      content: a.content,
      id: a.id
    })));
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
          audioUrl: `https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-13${i}.mp3`,
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
        audioUrl: `https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-13${i % 5}.mp3`,
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
      videoUrl: finalVideoUrl,
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

  const handlePlayVoicePreview = (voice) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Set the new voice preview
    setCurrentVoicePreview(voice);
    setIsPlayingVoice(true);
    
    // Play after a short delay to ensure the new source is loaded
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const handleAudioEnded = () => {
    setIsPlayingVoice(false);
  };

  const handleEditSegment = (segment) => {
    setEditingSegmentId(segment.id);
    setEditingSegmentText(segment.text);
  };

  const handleSaveSegmentEdit = () => {
    if (!editingSegmentId) return;
    
    setVideoInfo(prev => ({
      ...prev,
      audioSegments: prev.audioSegments.map(segment => 
        segment.id === editingSegmentId 
          ? { ...segment, text: editingSegmentText, isGenerated: false, audioUrl: null } 
          : segment
      )
    }));
    
    setEditingSegmentId(null);
    setEditingSegmentText('');
  };

  const handleCancelSegmentEdit = () => {
    setEditingSegmentId(null);
    setEditingSegmentText('');
  };

  const handleRegenerateSegment = async (segment) => {
    // Simulate regenerating a single segment
    setIsGeneratingAudio(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVideoInfo(prev => ({
      ...prev,
      audioSegments: prev.audioSegments.map(s => 
        s.id === segment.id 
          ? {
              ...s,
              audioUrl: `https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-13${Math.floor(Math.random() * 5)}.mp3`,
              isGenerated: true,
              duration: Math.floor(Math.random() * 10) + 5
            }
          : s
      )
    }));
    
    setIsGeneratingAudio(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select AI Model</h3>
            
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

            <div className="flex justify-end space-x-3 pt-4">
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
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Avatar and Voice</h3>
            
            {/* Video Avatar Selection */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <VideoIcon className="w-5 h-5 mr-2 text-blue-600" />
                Choose Video Avatar
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{avatar.name}</p>
                      <p className="text-sm text-gray-600">{avatar.style}</p>
                    </div>
                    {videoInfo.videoAvatar === avatar.id && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAvatarPreview(true);
                        }}
                        className="ml-2 p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                        title="Preview avatar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {videoInfo.audioAvatar === voice.id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPlayingVoice && currentVoicePreview?.id === voice.id) {
                              if (audioRef.current) {
                                audioRef.current.pause();
                              }
                              setIsPlayingVoice(false);
                            } else {
                              handlePlayVoicePreview(voice);
                            }
                          }}
                          className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                        >
                          {isPlayingVoice && currentVoicePreview?.id === voice.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio player for voice preview */}
            <audio 
              ref={audioRef}
              src={currentVoicePreview?.sampleUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />

            {/* Avatar Preview Modal */}
            {showAvatarPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Avatar Preview: {(videoModel === 'heygen' ? HEYGEN_AVATARS : AKOOL_AVATARS).find(a => a.id === videoInfo.videoAvatar)?.name}
                    </h3>
                    <button
                      onClick={() => setShowAvatarPreview(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video 
                        ref={videoRef}
                        controls
                        className="w-full h-full"
                        src="https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-working-on-a-laptop-in-a-meeting-room-32493-large.mp4"
                        poster={(videoModel === 'heygen' ? HEYGEN_AVATARS : AKOOL_AVATARS).find(a => a.id === videoInfo.videoAvatar)?.thumbnail}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      This is a preview of how your selected avatar will appear in the final video.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between space-x-3 pt-4">
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
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Script Editor</h3>
            
            <div className="space-y-4">
              <ScriptEditor
                script={videoInfo.script}
                onScriptChange={(newScript) => setVideoInfo(prev => ({ ...prev, script: newScript }))}
                onMediaAssign={handleMediaAssign}
                initialAnnotations={videoInfo.mediaAssignments}
              />
            </div>

            <div className="flex justify-between space-x-3 pt-4">
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
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Generation</h3>
            
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
                  disabled={isGeneratingAudio || audioPreviewSegments.length > 0 || videoInfo.audioSegments.length === 0}
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
                      Generate 10-Second Preview
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Full Generation */}
            {(audioPreviewSegments.length > 0 || videoInfo.audioSegments.some(s => s.isGenerated)) && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Full Audio Generation</h4>
                  {!videoInfo.audioSegments.every(s => s.isGenerated) && (
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
                  )}
                </div>

                {videoInfo.audioSegments.some(s => s.isGenerated) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">
                        {showCombinedAudio ? "Combined Audio" : "Individual Segments"}
                      </h5>
                      <button
                        onClick={() => setShowCombinedAudio(!showCombinedAudio)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        {showCombinedAudio ? (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show Individual Segments
                          </>
                        ) : (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Show Combined Audio
                          </>
                        )}
                      </button>
                    </div>

                    {/* Combined Audio View */}
                    {showCombinedAudio ? (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">Complete Audio Track</h5>
                            <p className="text-sm text-gray-600">
                              {videoInfo.audioSegments.filter(s => s.isGenerated).length} of {videoInfo.audioSegments.length} segments generated
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {videoInfo.audioSegments.reduce((acc, seg) => acc + (seg.duration || 0), 0)}s total
                            </span>
                            <button
                              onClick={() => {
                                // Play combined audio logic would go here
                                console.log("Playing combined audio");
                              }}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Audio waveform visualization */}
                        <div className="h-16 bg-white rounded-lg p-2 flex items-center">
                          <div className="w-full h-full flex items-center">
                            {Array.from({ length: 50 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 mx-0.5 bg-blue-500 rounded-full"
                                style={{ 
                                  height: `${20 + Math.sin(i * 0.2) * 15 + Math.random() * 10}%`,
                                  opacity: i % 3 === 0 ? 0.7 : 1
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Individual Segments View with animation
                      <div className="space-y-3 transition-all duration-300 ease-in-out">
                        {videoInfo.audioSegments.map((segment, index) => (
                          <div 
                            key={segment.id} 
                            className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                              segment.isGenerated ? 'bg-white' : 'bg-gray-50'
                            }`}
                            style={{
                              animationDelay: `${index * 100}ms`,
                              transform: `translateY(${index * 5}px)`,
                              opacity: segment.isGenerated ? 1 : 0.7
                            }}
                          >
                            {editingSegmentId === segment.id ? (
                              <div className="p-4">
                                <textarea
                                  value={editingSegmentText}
                                  onChange={(e) => setEditingSegmentText(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                  rows={3}
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={handleCancelSegmentEdit}
                                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveSegmentEdit}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                      {segment.id}
                                    </span>
                                    <h6 className="font-medium text-gray-900">Segment {segment.id}</h6>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {segment.isGenerated && (
                                      <>
                                        <span className="text-xs text-gray-500">{segment.duration}s</span>
                                        <button
                                          onClick={() => setCurrentPlayingSegment(segment.id === currentPlayingSegment ? null : segment.id)}
                                          className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                        >
                                          {currentPlayingSegment === segment.id ? (
                                            <Pause className="w-3.5 h-3.5" />
                                          ) : (
                                            <Play className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{segment.text}</p>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditSegment(segment)}
                                    className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </button>
                                  {segment.isGenerated ? (
                                    <button
                                      onClick={() => handleRegenerateSegment(segment)}
                                      className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 flex items-center"
                                      disabled={isGeneratingAudio}
                                    >
                                      <RefreshCw className={`w-3 h-3 mr-1 ${isGeneratingAudio ? 'animate-spin' : ''}`} />
                                      Regenerate
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleRegenerateSegment(segment)}
                                      className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-lg hover:bg-green-200 flex items-center"
                                      disabled={isGeneratingAudio}
                                    >
                                      <Wand2 className="w-3 h-3 mr-1" />
                                      Generate
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                  onClick={() => navigate('/videos')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  disabled={videoInfo.audioSegments.length === 0 || !videoInfo.audioSegments.some(s => s.isGenerated)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Compilation</h3>
            
            {!videoInfo.isGenerating && !showFinalVideo ? (
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
            ) : videoInfo.isGenerating ? (
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
            ) : (
              // Final Video Player
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Video Generated Successfully!</h4>
                  </div>
                  <p className="text-sm text-green-800 ml-8">
                    Your video has been created and is ready to view. You can download it or share it with others.
                  </p>
                </div>
                
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    controls
                    className="w-full h-full"
                    src={finalVideoUrl}
                    poster="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
                  />
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Title:</span> {videoInfo.name}</p>
                    <p><span className="font-medium">Duration:</span> {videoInfo.audioSegments.reduce((acc, seg) => acc + (seg.duration || 0), 0)} seconds</p>
                    <p><span className="font-medium">Quality:</span> 1080p HD</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between space-x-3 pt-4">
              {!showFinalVideo && !videoInfo.isGenerating && (
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              <div className="flex space-x-3 ml-auto">
                {showFinalVideo && (
                  <button
                    onClick={() => navigate('/videos')}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 inline" />
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Model', icon: Settings },
            { step: 2, label: 'Avatar', icon: User },
            { step: 3, label: 'Script', icon: FileText },
            { step: 4, label: 'Audio', icon: Mic },
            { step: 5, label: 'Video', icon: VideoIcon }
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`mt-2 text-xs font-medium ${
                step <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {label}
              </div>
              {step < 5 && (
                <div className={`hidden sm:block absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} style={{ left: `${(step - 0.5) * 25}%`, width: '25%' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>
    </div>
  );
}