import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Video, 
  Mic, 
  MessageSquare, 
  GraduationCap,
  Upload,
  Calendar,
  Users,
  Share2,
  Lock,
  Edit3,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Link
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { CourseGenerationModal } from '../components/Courses/CourseGenerationModal';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { InlineHint } from '../components/Guidance/InlineHint';
import { useGuidance } from '../hooks/useGuidance';
import { HINTS } from '../constants/hints';

export function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { markStepCompleted } = useGuidance();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');

  const project = state.projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const handleAddContent = (type) => {
    markStepCompleted(`add_content_${type}`);
    
    switch (type) {
      case 'chat':
        navigate(`/chat?project=${projectId}`);
        break;
      case 'upload':
        // Create a file input element and trigger it
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf,.doc,.docx,.txt,.mp3,.mp4,.wav,.mov';
        fileInput.onchange = (e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach((file, index) => {
              const asset = {
                id: Date.now().toString() + index,
                projectId: project.id,
                type: getFileType(file.type),
                title: file.name,
                content: `Uploaded file: ${file.name}`,
                metadata: {
                  size: file.size,
                  tags: ['uploaded'],
                  language: 'en'
                },
                createdAt: new Date(),
              };
              
              dispatch({
                type: 'ADD_MEDIA_ASSET',
                payload: { projectId: project.id, asset }
              });
            });
            
            dispatch({
              type: 'ADD_SYSTEM_MESSAGE',
              payload: {
                id: Date.now().toString(),
                type: 'success',
                title: 'Files Uploaded',
                message: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''} to ${project.title}`,
                timestamp: new Date(),
                isRead: false,
              }
            });
          }
        };
        fileInput.click();
        break;
      case 'voice':
        navigate(`/chat?project=${projectId}&mode=voice`);
        break;
      case 'video':
        navigate(`/chat?project=${projectId}&mode=video`);
        break;
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'document': return FileText;
      case 'audio': return Mic;
      case 'video': return Video;
      case 'chatlog': return MessageSquare;
      case 'voice': return Mic;
      case 'avatar': return Video;
      default: return FileText;
    }
  };

  const getAssetColor = (type) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'audio': return 'bg-green-100 text-green-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'chatlog': return 'bg-orange-100 text-orange-600';
      case 'voice': return 'bg-emerald-100 text-emerald-600';
      case 'avatar': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleViewCourse = (course) => {
    markStepCompleted('course_viewed');
    navigate(`/projects/${projectId}`);
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Course Viewer',
        message: `Opening "${course.title}" course viewer...`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const composedFromProjects = project.composedFrom 
    ? state.projects.filter(p => project.composedFrom.includes(p.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <HintTooltip hint={HINTS.RETURN_TO_PROJECT} position="bottom">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </HintTooltip>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {project.isShared ? (
              <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                <Share2 className="w-4 h-4 mr-1" />
                Shared
              </div>
            ) : (
              <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                <Lock className="w-4 h-4 mr-1" />
                Private
              </div>
            )}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Composed From Projects */}
      {composedFromProjects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">Composed from Knowledge</h3>
              <div className="flex flex-wrap gap-2">
                {composedFromProjects.map((sourceProject) => (
                  <HintTooltip 
                    key={sourceProject.id}
                    hint="Click to view the original project that contributed knowledge to this one"
                    position="top"
                  >
                    <button
                      onClick={() => navigate(`/projects/${sourceProject.id}`)}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <FolderOpen className="w-3 h-3 mr-1" />
                      {sourceProject.title}
                    </button>
                  </HintTooltip>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-2">
                This project includes knowledge and assets from {composedFromProjects.length} other project{composedFromProjects.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Media Assets</p>
              <p className="text-2xl font-bold text-gray-900">{project.mediaAssets.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">{project.courses.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collaborators</p>
              <p className="text-2xl font-bold text-gray-900">{project.collaborators.length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">{new Date(project.updatedAt).toLocaleDateString()}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Content</h3>
        <InlineHint 
          message="Choose how you want to add knowledge to this project. Each method will create assets that can be used for course generation."
          type="tip"
          className="mb-4"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HintTooltip hint={HINTS.BILLY_CHAT} position="top">
            <button
              onClick={() => handleAddContent('chat')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Billy Chat</span>
              <span className="text-xs text-gray-600 text-center mt-1">Interactive conversation</span>
            </button>
          </HintTooltip>
          
          <HintTooltip hint={HINTS.UPLOAD_DOCUMENTS} position="top">
            <button
              onClick={() => handleAddContent('upload')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Upload Files</span>
              <span className="text-xs text-gray-600 text-center mt-1">Documents, videos, audio</span>
            </button>
          </HintTooltip>
          
          <HintTooltip hint={HINTS.VOICE_RECORD} position="top">
            <button
              onClick={() => handleAddContent('voice')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Voice Record</span>
              <span className="text-xs text-gray-600 text-center mt-1">Capture knowledge by voice</span>
            </button>
          </HintTooltip>
          
          <HintTooltip hint={HINTS.GENERATE_COURSE} position="top">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Generate Course</span>
              <span className="text-xs text-gray-600 text-center mt-1">Create structured learning</span>
            </button>
          </HintTooltip>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'assets', label: 'Media Assets', count: project.mediaAssets.length },
              { id: 'courses', label: 'Courses', count: project.courses.length },
              { id: 'activity', label: 'Activity', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'assets' && (
            <div>
              {project.mediaAssets.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No media assets yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding content through Billy Chat or file uploads</p>
                  <HintTooltip hint={HINTS.BILLY_CHAT} position="top">
                    <button
                      onClick={() => handleAddContent('chat')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start with Billy Chat
                    </button>
                  </HintTooltip>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.mediaAssets.map((asset) => {
                    const Icon = getAssetIcon(asset.type);
                    const colorClass = getAssetColor(asset.type);
                    
                    return (
                      <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{asset.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 capitalize">{asset.type}</p>
                        {asset.metadata.sourceProject && (
                          <p className="text-xs text-blue-600 mb-1">From: {asset.metadata.sourceProject}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              {project.courses.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Generate your first course from the project content</p>
                  <HintTooltip hint={HINTS.GENERATE_COURSE} position="top">
                    <button
                      onClick={() => setIsGenerateModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Generate Course
                    </button>
                  </HintTooltip>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {course.status?.status || 'Ready'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.objective}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{course.sections?.length || 0} sections</span>
                        <span>{course.language}</span>
                      </div>
                      <button
                        onClick={() => handleViewCourse(course)}
                        className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        View Course
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Activity Timeline</h3>
              <p className="text-gray-600">Project activity tracking coming soon</p>
            </div>
          )}
        </div>
      </div>

      <CourseGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        projectId={project.id}
      />
    </div>
  );
}