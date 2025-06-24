import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Video, VideoOff, Camera, Loader } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function ChatInterface({ selectedProjects, interactionMode }) {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: selectedProjects.length > 0 
        ? `Hi! I'm Billy, your AI assistant. I see you've selected ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} to work with. I'm here to help you capture and transform your knowledge. What would you like to explore today?`
        : "Hi! I'm Billy, your AI assistant. Please select at least one project to get started with knowledge capture.",
      sender: 'billy',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update Billy's greeting when projects change
    if (selectedProjects.length > 0) {
      const projectNames = selectedProjects.map(id => 
        state.projects.find(p => p.id === id)?.title
      ).filter(Boolean).join(', ');
      
      setMessages(prev => [{
        id: '1',
        text: `Hi! I'm Billy, your AI assistant. I see you've selected: ${projectNames}. I'm here to help you capture and transform your knowledge for these projects. What would you like to explore today?`,
        sender: 'billy',
        timestamp: new Date(),
      }, ...prev.slice(1)]);
    }
  }, [selectedProjects, state.projects]);

  const handleSendMessage = () => {
    if (!inputText.trim() || selectedProjects.length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Create media asset from conversation
    selectedProjects.forEach(projectId => {
      dispatch({
        type: 'ADD_MEDIA_ASSET',
        payload: {
          projectId,
          asset: {
            id: Date.now().toString() + Math.random(),
            projectId,
            type: 'chatlog',
            title: `Billy Chat - ${new Date().toLocaleDateString()}`,
            content: inputText,
            metadata: {
              tags: ['billy-chat', 'knowledge-capture'],
              language: 'en'
            },
            createdAt: new Date(),
          }
        }
      });
    });

    // Simulate Billy's response with typing indicator
    setTimeout(() => {
      const billyResponse = {
        id: (Date.now() + 1).toString(),
        text: getBillyResponse(inputText),
        sender: 'billy',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, billyResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBillyResponse = (userMessage) => {
    const responses = [
      "That's fascinating! Tell me more about that topic. I can help you structure this into a comprehensive learning module for your selected projects.",
      "Great insight! Would you like me to help you create a course around this concept? I can generate it for any of your selected projects.",
      "I understand. Let me help you organize these thoughts. Have you considered breaking this down into smaller, digestible sections for your course content?",
      "Excellent! This could make for great content. Should we start by outlining the key points you want to cover in your projects?",
      "Interesting perspective! I can help you develop this into a full educational experience. What's your target audience for these projects?",
      "I love how you're thinking about this! Let's dive deeper - what specific challenges does your audience face with this topic?",
      "This sounds like valuable knowledge! Would you like me to help you create an engaging narrative around these concepts for your projects?",
      "Perfect! I can see this fitting well into your project structure. Should we create some course modules based on what you've shared?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleRecording = () => {
    if (selectedProjects.length === 0) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'No Projects Selected',
          message: 'Please select at least one project before starting voice recording.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }

    setIsRecording(!isRecording);
    if (!isRecording) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Voice Recording Started',
          message: 'Listening... Speak clearly into your microphone. Your voice will be captured for your selected projects.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    } else {
      // Create voice media asset
      selectedProjects.forEach(projectId => {
        dispatch({
          type: 'ADD_MEDIA_ASSET',
          payload: {
            projectId,
            asset: {
              id: Date.now().toString() + Math.random(),
              projectId,
              type: 'voice',
              title: `Voice Capture - ${new Date().toLocaleDateString()}`,
              content: 'Voice recording transcribed and processed',
              metadata: {
                duration: Math.floor(Math.random() * 300) + 60,
                tags: ['voice-capture', 'billy-session'],
                language: 'en'
              },
              createdAt: new Date(),
            }
          }
        });
      });

      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Voice Recording Complete',
          message: `Audio captured and added to ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}!`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const toggleVideoRecording = () => {
    if (selectedProjects.length === 0) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'No Projects Selected',
          message: 'Please select at least one project before starting video recording.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }

    setIsVideoRecording(!isVideoRecording);
    if (!isVideoRecording) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Video Recording Started',
          message: 'Recording video session with Billy avatar. Your interaction will be captured for your selected projects.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    } else {
      // Create avatar interaction media asset
      selectedProjects.forEach(projectId => {
        dispatch({
          type: 'ADD_MEDIA_ASSET',
          payload: {
            projectId,
            asset: {
              id: Date.now().toString() + Math.random(),
              projectId,
              type: 'avatar',
              title: `Avatar Session - ${new Date().toLocaleDateString()}`,
              content: 'Interactive avatar session recorded and processed',
              metadata: {
                duration: Math.floor(Math.random() * 600) + 120,
                tags: ['avatar-session', 'video-capture', 'billy-interaction'],
                language: 'en'
              },
              createdAt: new Date(),
            }
          }
        });
      });

      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Video Session Complete',
          message: `Avatar interaction captured and added to ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}!`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const isDisabled = selectedProjects.length === 0;

  const renderModeSpecificInterface = () => {
    switch (interactionMode) {
      case 'voice':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    selectedProjects.length > 0 ? 'bg-emerald-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Voice Recording Mode</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProjects.length > 0 
                      ? `Connected to ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} • Ready to record`
                      : 'Select projects to start • Offline'
                    }
                  </p>
                </div>
              </div>
              
              {isRecording && (
                <div className="mt-4 flex items-center space-x-2 text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording audio...</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <button
                  onClick={toggleRecording}
                  disabled={isDisabled}
                  className={`w-24 h-24 rounded-full transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : isDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white mx-auto" />
                  ) : (
                    <Mic className="w-12 h-12 text-white mx-auto" />
                  )}
                </button>
                <p className="mt-4 text-lg font-medium text-gray-900">
                  {isRecording ? 'Recording...' : 'Tap to start recording'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isDisabled ? 'Select projects first' : 'Speak clearly into your microphone'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    selectedProjects.length > 0 ? 'bg-emerald-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Video Session Mode</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProjects.length > 0 
                      ? `Connected to ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} • Ready for video`
                      : 'Select projects to start • Offline'
                    }
                  </p>
                </div>
              </div>
              
              {isVideoRecording && (
                <div className="mt-4 flex items-center space-x-2 text-purple-600">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording video session...</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <button
                  onClick={toggleVideoRecording}
                  disabled={isDisabled}
                  className={`w-24 h-24 rounded-full transition-all duration-200 ${
                    isVideoRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : isDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 hover:scale-105'
                  }`}
                >
                  {isVideoRecording ? (
                    <VideoOff className="w-12 h-12 text-white mx-auto" />
                  ) : (
                    <Video className="w-12 h-12 text-white mx-auto" />
                  )}
                </button>
                <p className="mt-4 text-lg font-medium text-gray-900">
                  {isVideoRecording ? 'Recording...' : 'Start video session'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {isDisabled ? 'Select projects first' : 'Interactive conversation with Billy avatar'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    selectedProjects.length > 0 ? 'bg-emerald-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Billy AI Assistant</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProjects.length > 0 
                      ? `Connected to ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} • Online`
                      : 'Select projects to start • Offline'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-lg'
                        : 'bg-white text-gray-900 rounded-bl-lg border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.sender === 'billy' && (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-bl-lg bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-gray-200 bg-white">
              {isDisabled && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Select projects first:</span> Choose one or more projects to capture knowledge with Billy.
                  </p>
                </div>
              )}
              
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isDisabled ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    placeholder={isDisabled ? "Select projects to start chatting..." : "Type your message..."}
                    disabled={isDisabled}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isDisabled}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderModeSpecificInterface();
}