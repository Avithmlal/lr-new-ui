import React, { useState } from 'react';
import { X, Video, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { VideoEditor } from './VideoEditor';

export function CreateVideoModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    projectId: '',
  });
  
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type) return;
    
    if (formData.type === 'basic') {
      setShowEditor(true);
    } else {
      // For template based, we'll implement this later
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Template Based Video',
          message: 'Template based video creation is coming soon!',
          timestamp: new Date(),
          isRead: false,
        }
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      projectId: '',
    });
    setShowEditor(false);
    onClose();
  };

  if (!isOpen) return null;
  
  if (showEditor) {
    return (
      <VideoEditor 
        isOpen={true} 
        onClose={handleClose} 
        videoData={{
          name: formData.title,
          projectId: formData.projectId || state.projects[0]?.id,
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Video</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter video title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source Project (Optional)</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a project...</option>
              {state.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Video Type</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setFormData(prev => ({ ...prev, type: 'basic' }))}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.type === 'basic'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Basic Video</h3>
                </div>
                <p className="text-sm text-gray-600">AI-generated video with avatar and voice synthesis</p>
              </div>

              <div
                onClick={() => setFormData(prev => ({ ...prev, type: 'template' }))}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.type === 'template'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Template Based</h3>
                </div>
                <p className="text-sm text-gray-600">Structured video following professional templates</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title || !formData.type}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}