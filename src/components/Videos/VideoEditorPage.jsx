import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Save, X } from 'lucide-react';
import { VideoEditor } from './VideoEditor';
import { useApp } from '../../contexts/AppContext';

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
    navigate('/videos');
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

      <main className="p-6">
        <VideoEditor 
          isOpen={isEditorOpen} 
          onClose={handleClose} 
          videoData={videoData} 
        />
      </main>
    </div>
  );
}