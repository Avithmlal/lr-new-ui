import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { VideoEditor } from './VideoEditor';

export function VideoEditorPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const [videoData, setVideoData] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  useEffect(() => {
    // Find the video in the state
    const video = state.videos?.find(v => v.id === videoId);
    if (video) {
      setVideoData(video);
    } else {
      // If video not found, redirect to videos page
      navigate('/videos');
    }
  }, [videoId, state.videos, navigate]);

  const handleClose = () => {
    setIsEditorOpen(false);
    navigate('/videos');
  };

  if (!videoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/videos')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{videoData.title}</h1>
              <p className="text-gray-600 text-sm">Video Editor</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2 inline" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Editor */}
      <VideoEditor
        isOpen={isEditorOpen}
        onClose={handleClose}
        videoData={videoData}
      />
    </div>
  );
}