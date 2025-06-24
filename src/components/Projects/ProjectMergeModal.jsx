import React, { useState } from 'react';
import { X, Merge, FolderOpen, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function ProjectMergeModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [targetProject, setTargetProject] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [mergeMode, setMergeMode] = useState('existing');

  const handleProjectToggle = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleMerge = () => {
    if (selectedProjects.length < 2) return;

    if (mergeMode === 'new' && !newProjectTitle.trim()) return;

    const projectsToMerge = state.projects.filter(p => selectedProjects.includes(p.id));
    
    let finalProject;

    if (mergeMode === 'existing' && targetProject) {
      const target = state.projects.find(p => p.id === targetProject);
      if (!target) return;

      // Merge into existing project
      const otherProjects = projectsToMerge.filter(p => p.id !== targetProject);
      const allAssets = [
        ...target.mediaAssets,
        ...otherProjects.flatMap(p => p.mediaAssets.map(asset => ({
          ...asset,
          projectId: target.id,
          id: Date.now().toString() + Math.random(),
        })))
      ];
      
      const allCourses = [
        ...target.courses,
        ...otherProjects.flatMap(p => p.courses.map(course => ({
          ...course,
          projectId: target.id,
          id: Date.now().toString() + Math.random(),
        })))
      ];

      finalProject = {
        ...target,
        description: `${target.description} (Merged with: ${otherProjects.map(p => p.title).join(', ')})`,
        mediaAssets: allAssets,
        courses: allCourses,
        collaborators: [...new Set([...target.collaborators, ...otherProjects.flatMap(p => p.collaborators)])],
        updatedAt: new Date(),
      };

      dispatch({ type: 'UPDATE_PROJECT', payload: finalProject });
      
      // Remove merged projects
      otherProjects.forEach(project => {
        // In a real app, you'd have a DELETE_PROJECT action
        console.log(`Would delete project: ${project.title}`);
      });

    } else if (mergeMode === 'new') {
      // Create new merged project
      const allAssets = projectsToMerge.flatMap(p => 
        p.mediaAssets.map(asset => ({
          ...asset,
          projectId: Date.now().toString(),
          id: Date.now().toString() + Math.random(),
        }))
      );
      
      const allCourses = projectsToMerge.flatMap(p => 
        p.courses.map(course => ({
          ...course,
          projectId: Date.now().toString(),
          id: Date.now().toString() + Math.random(),
        }))
      );

      finalProject = {
        id: Date.now().toString(),
        title: newProjectTitle,
        description: `Merged project from: ${projectsToMerge.map(p => p.title).join(', ')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        mediaAssets: allAssets,
        courses: allCourses,
        isShared: projectsToMerge.some(p => p.isShared),
        collaborators: [...new Set(projectsToMerge.flatMap(p => p.collaborators))],
      };

      dispatch({ type: 'ADD_PROJECT', payload: finalProject });
    }

    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Projects Merged Successfully',
        message: `${selectedProjects.length} projects have been merged into "${finalProject.title}".`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    setSelectedProjects([]);
    setTargetProject('');
    setNewProjectTitle('');
    onClose();
  };

  if (!isOpen) return null;

  const availableTargets = state.projects.filter(p => 
    selectedProjects.includes(p.id) && selectedProjects.length > 1
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Merge className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Merge Projects</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-sm text-amber-700 mt-1">
                  Merging projects will combine all media assets, courses, and collaborators. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Select Projects to Merge</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {state.projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectToggle(project.id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedProjects.includes(project.id)
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedProjects.includes(project.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedProjects.includes(project.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{project.title}</p>
                      <p className="text-sm text-gray-600 truncate">{project.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.mediaAssets.length} assets • {project.courses.length} courses
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedProjects.length} projects
            </p>
          </div>

          {selectedProjects.length >= 2 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">Merge Options</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="existing"
                    name="mergeMode"
                    value="existing"
                    checked={mergeMode === 'existing'}
                    onChange={(e) => setMergeMode(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="existing" className="text-sm font-medium text-gray-900">
                    Merge into existing project
                  </label>
                </div>
                
                {mergeMode === 'existing' && (
                  <div className="ml-7">
                    <select
                      value={targetProject}
                      onChange={(e) => setTargetProject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select target project...</option>
                      {availableTargets.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="new"
                    name="mergeMode"
                    value="new"
                    checked={mergeMode === 'new'}
                    onChange={(e) => setMergeMode(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="new" className="text-sm font-medium text-gray-900">
                    Create new merged project
                  </label>
                </div>
                
                {mergeMode === 'new' && (
                  <div className="ml-7">
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Enter new project title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={
              selectedProjects.length < 2 ||
              (mergeMode === 'existing' && !targetProject) ||
              (mergeMode === 'new' && !newProjectTitle.trim())
            }
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Merge className="w-4 h-4 mr-2 inline" />
            Merge Projects
          </button>
        </div>
      </div>
    </div>
  );
}