import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, Video, ArrowLeft, Plus, Calendar, Clock, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { ProjectDropdown } from '../components/Common/ProjectDropdown';
import { Pagination } from '../components/Common/Pagination';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { InlineHint } from '../components/Guidance/InlineHint';
import { useGuidance } from '../hooks/useGuidance';
import { useApp } from '../contexts/AppContext';
import { HINTS } from '../constants/hints';

export function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useApp();
  const { markStepCompleted } = useGuidance();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [interactionMode, setInteractionMode] = useState('chat');
  const [showSessions, setShowSessions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);

  // Mock Billy sessions data
  const [billySessions] = useState([
    {
      id: '1',
      projectId: '1',
      projectTitle: 'React Mastery Course',
      title: 'React Hooks Discussion',
      mode: 'chat',
      duration: 1800,
      messagesCount: 24,
      createdAt: new Date('2024-01-20T10:30:00'),
      lastActivity: new Date('2024-01-20T11:00:00'),
    },
    {
      id: '2',
      projectId: '1',
      projectTitle: 'React Mastery Course',
      title: 'Voice Recording Session',
      mode: 'voice',
      duration: 900,
      messagesCount: 0,
      createdAt: new Date('2024-01-19T14:15:00'),
      lastActivity: new Date('2024-01-19T14:30:00'),
    },
    {
      id: '3',
      projectId: '2',
      projectTitle: 'JavaScript Fundamentals',
      title: 'Avatar Video Session',
      mode: 'video',
      duration: 2400,
      messagesCount: 18,
      createdAt: new Date('2024-01-18T16:45:00'),
      lastActivity: new Date('2024-01-18T17:25:00'),
    },
    // Add more mock sessions...
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `session-${i + 4}`,
      projectId: Math.random() > 0.5 ? '1' : '2',
      projectTitle: Math.random() > 0.5 ? 'React Mastery Course' : 'JavaScript Fundamentals',
      title: `Session ${i + 4}`,
      mode: ['chat', 'voice', 'video'][Math.floor(Math.random() * 3)],
      duration: Math.floor(Math.random() * 3600) + 300,
      messagesCount: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }))
  ]);

  // Initialize from URL params
  useEffect(() => {
    const projectParam = searchParams.get('project');
    const modeParam = searchParams.get('mode');
    
    if (projectParam) {
      setSelectedProjects([projectParam]);
    }
    
    if (modeParam && ['chat', 'voice', 'video'].includes(modeParam)) {
      setInteractionMode(modeParam);
    }
  }, [searchParams]);

  const handleProjectToggle = (projectId) => {
    markStepCompleted('project_selected_for_chat');
    setSelectedProjects([projectId]); // Single selection for simplicity
  };

  const handleBackToProject = () => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
      navigate(`/projects/${projectParam}`);
    } else {
      navigate('/projects');
    }
  };

  const handleModeChange = (mode) => {
    markStepCompleted(`interaction_mode_${mode}`);
    setInteractionMode(mode);
  };

  const handleStartNewSession = () => {
    setShowSessions(false);
    markStepCompleted('new_session_started');
  };

  const handleViewSession = (session) => {
    markStepCompleted('session_viewed');
    // Navigate to session or load session data
    console.log('Loading session:', session);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'chat': return MessageSquare;
      case 'voice': return Mic;
      case 'video': return Video;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'chat': return 'bg-blue-100 text-blue-600';
      case 'voice': return 'bg-green-100 text-green-600';
      case 'video': return 'bg-purple-100 text-purple-600';
    }
  };

  // Filter sessions by selected projects
  const filteredSessions = billySessions.filter(session => 
    selectedProjects.length === 0 || selectedProjects.includes(session.projectId)
  );

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + sessionsPerPage);

  const interactionModes = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
  ];

  const projectParam = searchParams.get('project');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {projectParam && (
            <HintTooltip hint={HINTS.RETURN_TO_PROJECT} position="bottom">
              <button
                onClick={handleBackToProject}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </HintTooltip>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billy AI Assistant</h1>
            <p className="text-gray-600 mt-1">Capture knowledge through conversation and voice</p>
          </div>
        </div>
        
        {/* Session Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showSessions 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showSessions ? 'New Session' : 'View Sessions'}
          </button>
        </div>
      </div>

      {/* Project Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Project</h3>
          {selectedProjects.length > 0 && (
            <span className="text-sm text-blue-600 font-medium truncate ml-2">
              {state.projects.find(p => p.id === selectedProjects[0])?.title}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProjectDropdown
            selectedProjects={selectedProjects}
            onProjectToggle={handleProjectToggle}
            onCreateProject={() => setIsCreateModalOpen(true)}
            multiple={false}
            placeholder="Choose a project..."
          />
          
          {!showSessions && (
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
              {interactionModes.map((mode) => (
                <HintTooltip 
                  key={mode.id}
                  hint={`Switch to ${mode.label.toLowerCase()} mode`}
                  position="bottom"
                >
                  <button
                    onClick={() => handleModeChange(mode.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      interactionMode === mode.id
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <mode.icon className="w-4 h-4 mr-2" />
                    {mode.label}
                  </button>
                </HintTooltip>
              ))}
            </div>
          )}
        </div>

        {selectedProjects.length === 0 && (
          <InlineHint 
            message="Select a project to start capturing knowledge with Billy."
            type="info"
            className="mt-4"
          />
        )}
      </div>

      {showSessions ? (
        /* Billy Sessions List */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Billy Sessions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProjects.length > 0 
                    ? `Sessions for selected project`
                    : 'All your Billy AI conversations'
                  }
                </p>
              </div>
              <button
                onClick={handleStartNewSession}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-4">
                  {selectedProjects.length > 0 
                    ? 'Start your first Billy session for this project'
                    : 'Select a project and start your first Billy session'
                  }
                </p>
                <button
                  onClick={handleStartNewSession}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start First Session
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedSessions.map((session) => {
                    const ModeIcon = getModeIcon(session.mode);
                    const modeColor = getModeColor(session.mode);
                    
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleViewSession(session)}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${modeColor} mr-4 flex-shrink-0`}>
                          <ModeIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{session.title}</h4>
                            <span className="text-xs text-gray-500 capitalize ml-2 flex-shrink-0">{session.mode}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 truncate">{session.projectTitle}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDuration(session.duration)}
                            </div>
                            {session.messagesCount > 0 && (
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {session.messagesCount}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {session.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={sessionsPerPage}
                  totalItems={filteredSessions.length}
                  className="mt-6"
                />
              </>
            )}
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div>
          <InlineHint 
            message="Choose your interaction mode and start capturing knowledge with Billy."
            type="tip"
            className="mb-6"
          />
          
          <ChatInterface 
            selectedProjects={selectedProjects} 
            interactionMode={interactionMode}
          />
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}