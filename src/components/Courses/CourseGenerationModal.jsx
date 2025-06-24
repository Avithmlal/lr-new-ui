import React, { useState } from 'react';
import { X, GraduationCap, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export function CourseGenerationModal({ isOpen, onClose, projectId }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    language: 'English',
    targetAudience: '',
    selectedProject: projectId || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.objective || !formData.selectedProject) return;

    // Create the basic course object
    const courseId = Date.now().toString();
    const newCourse = {
      id: courseId,
      projectId: formData.selectedProject,
      title: formData.title,
      objective: formData.objective,
      language: formData.language,
      targetAudience: formData.targetAudience,
      sections: [], // Empty initially
      status: {
        status: 'draft',
        progress: 0,
        message: 'Course created - ready for lesson plan generation',
      },
      createdAt: new Date(),
    };

    // Add course to project
    dispatch({
      type: 'ADD_COURSE',
      payload: {
        projectId: formData.selectedProject,
        course: newCourse,
      }
    });

    // Show success message
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Course Created',
        message: `"${formData.title}" has been created. You can now generate the lesson plan and customize modules.`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Navigate to course detail page
    navigate(`/courses/${courseId}?project=${formData.selectedProject}`);
    
    // Reset form and close modal
    setFormData({
      title: '',
      objective: '',
      language: 'English',
      targetAudience: '',
      selectedProject: projectId || '',
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      objective: '',
      language: 'English',
      targetAudience: '',
      selectedProject: projectId || '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Course</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={formData.selectedProject}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedProject: e.target.value }))}
              disabled={!!projectId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
            >
              <option value="">Select a project...</option>
              {state.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter course title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objective</label>
            <textarea
              value={formData.objective}
              onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What should learners achieve after completing this course?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Beginners"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong> After creating the course, you'll be taken to the course detail page where you can generate the lesson plan, customize modules, and manage the full course creation process.
            </p>
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
              disabled={!formData.title || !formData.objective || !formData.selectedProject}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4 mr-2 inline" />
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}