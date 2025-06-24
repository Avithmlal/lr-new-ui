import React, { useState, useEffect } from 'react';
import { Plus, Play, Calendar, Clock, Eye, Edit3, Trash2, Video, Wand2, FileText, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateVideoModal } from '../components/Videos/CreateVideoModal';
import { Pagination } from '../components/Common/Pagination';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { InlineHint } from '../components/Guidance/InlineHint';
import { useApp } from '../contexts/AppContext';

export function Videos() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(9);

  // Initialize with sample videos if none exist
  useEffect(() => {
    if (!state.videos || state.videos.length === 0) {
      const sampleVideos = [
        {
          id: '1',
          title: 'React Hooks Explained',
          description: 'A comprehensive guide to understanding and using React hooks effectively in modern applications.',
          type: 'basic',
          projectId: '1',
          projectTitle: 'React Mastery Course',
          status: 'completed',
          duration: 1245, // seconds
          thumbnailUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoUrl: '#',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          views: 156,
          metadata: {
            resolution: '1080p',
            format: 'mp4',
            size: '45.2 MB',
            avatar: 'Professional Sarah',
            language: 'English'
          }
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript programming with practical examples and exercises.',
          type: 'template',
          projectId: '2',
          projectTitle: 'JavaScript Fundamentals',
          status: 'generating',
          duration: 0,
          thumbnailUrl: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoUrl: null,
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
          views: 0,
          metadata: {
            resolution: '1080p',
            format: 'mp4',
            size: null,
            avatar: 'Friendly Mike',
            language: 'English'
          }
        },
        {
          id: '3',
          title: 'Advanced State Management',
          description: 'Deep dive into advanced state management patterns using Redux and Context API.',
          type: 'basic',
          projectId: '1',
          projectTitle: 'React Mastery Course',
          status: 'draft',
          duration: 0,
          thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
          videoUrl: null,
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-19'),
          views: 0,
          metadata: {
            resolution: '1080p',
            format: 'mp4',
            size: null,
            avatar: 'Professional Sarah',
            language: 'English'
          }
        },
        // Add more sample videos for pagination testing
        ...Array.from({ length: 15 }, (_, i) => ({
          id: `video-${i + 4}`,
          title: `Sample Video ${i + 4}`,
          description: `This is a sample video description for video ${i + 4} to test the pagination and filtering functionality.`,
          type: Math.random() > 0.5 ? 'basic' : 'template',
          projectId: Math.random() > 0.5 ? '1' : '2',
          projectTitle: Math.random() > 0.5 ? 'React Mastery Course' : 'JavaScript Fundamentals',
          status: ['draft', 'generating', 'completed', 'failed'][Math.floor(Math.random() * 4)],
          duration: Math.floor(Math.random() * 3600),
          thumbnailUrl: `https://images.pexels.com/photos/${4164418 + i}/pexels-photo-${4164418 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
          videoUrl: Math.random() > 0.5 ? '#' : null,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          views: Math.floor(Math.random() * 500),
          metadata: {
            resolution: '1080p',
            format: 'mp4',
            size: Math.random() > 0.5 ? `${(Math.random() * 100 + 10).toFixed(1)} MB` : null,
            avatar: ['Professional Sarah', 'Friendly Mike', 'Casual Emma', 'Expert David'][Math.floor(Math.random() * 4)],
            language: 'English'
          }
        }))
      ];

      dispatch({ type: 'SET_VIDEOS', payload: sampleVideos });
    }
  }, [state.videos, dispatch]);

  // Filter videos
  const filteredVideos = (state.videos || []).filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    const matchesType = typeFilter === 'all' || video.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + videosPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'basic': return 'bg-purple-100 text-purple-800';
      case 'template': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCreateVideo = () => {
    if (state.projects.length === 0) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'No Projects Available',
          message: 'Create a project first before generating videos.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleViewVideo = (video) => {
    if (video.status === 'completed' && video.videoUrl) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Opening Video',
          message: `Playing "${video.title}"...`,
          timestamp: new Date(),
          isRead: false,
        }
      });
      // In a real app, this would open a video player or navigate to video detail page
    } else {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'Video Not Ready',
          message: 'This video is not yet available for viewing.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const handleDeleteVideo = (videoId) => {
    dispatch({ type: 'DELETE_VIDEO', payload: videoId });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Video Deleted',
        message: 'Video has been permanently deleted.',
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-1">Create and manage AI-generated videos from your project content</p>
        </div>
        <HintTooltip hint="Create a new video using AI from your project content" position="bottom">
          <button 
            onClick={handleCreateVideo}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Video
          </button>
        </HintTooltip>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="draft">Draft</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="basic">Basic</option>
            <option value="template">Template Based</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredVideos.length} of {state.videos?.length || 0} videos
            </span>
          </div>

          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        <InlineHint 
          message="Videos are generated from your project content using AI avatars. Basic videos use simple generation, while Template-based videos follow structured formats."
          type="info"
        />
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {(state.videos?.length || 0) === 0 ? 'No videos yet' : 'No videos match your filters'}
          </h3>
          <p className="text-gray-600 mb-4">
            {(state.videos?.length || 0) === 0 
              ? 'Create your first AI-generated video from project content'
              : 'Try adjusting your search terms or filters'
            }
          </p>
          {(state.videos?.length || 0) === 0 ? (
            <button
              onClick={handleCreateVideo}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Video
            </button>
          ) : (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    {video.status === 'completed' ? (
                      <button
                        onClick={() => handleViewVideo(video)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg"
                      >
                        <Play className="w-6 h-6 text-gray-700" />
                      </button>
                    ) : video.status === 'generating' ? (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
                        <Wand2 className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                      {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                    </span>
                  </div>

                  {/* Duration */}
                  {video.duration > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getTypeColor(video.type)}`}>
                      {video.type === 'basic' ? 'Basic' : 'Template'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <p className="text-xs text-blue-600 mb-3 font-medium truncate">
                    From: {video.projectTitle}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{video.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{video.views}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewVideo(video)}
                      disabled={video.status !== 'completed'}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 mr-1 inline" />
                      {video.status === 'completed' ? 'Watch' : video.status === 'generating' ? 'Generating...' : 'Not Ready'}
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={videosPerPage}
            totalItems={filteredVideos.length}
          />
        </>
      )}

      <CreateVideoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}