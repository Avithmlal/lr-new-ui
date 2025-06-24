import React, { useState } from 'react';
import { X, Folder, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { HintTooltip } from '../Guidance/HintTooltip';
import { InlineHint } from '../Guidance/InlineHint';
import { HINTS } from '../../constants/hints';

export function CreateProjectModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [includeKnowledgeFrom, setIncludeKnowledgeFrom] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get knowledge from selected projects
    const sourceProjects = state.projects.filter(p => includeKnowledgeFrom.includes(p.id));
    const combinedAssets = sourceProjects.flatMap(p => 
      p.mediaAssets.map(asset => ({
        ...asset,
        id: Date.now().toString() + Math.random(),
        projectId: Date.now().toString(),
        metadata: {
          ...asset.metadata,
          sourceProject: p.title,
          tags: [...(asset.metadata.tags || []), 'imported-knowledge']
        }
      }))
    );

    const combinedCourses = sourceProjects.flatMap(p => 
      p.courses.map(course => ({
        ...course,
        id: Date.now().toString() + Math.random(),
        projectId: Date.now().toString(),
      }))
    );

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      mediaAssets: combinedAssets,
      courses: combinedCourses,
      isShared,
      collaborators: [],
      composedFrom: includeKnowledgeFrom.length > 0 ? includeKnowledgeFrom : undefined,
    };

    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    dispatch({ 
      type: 'ADD_SYSTEM_MESSAGE', 
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Project Created',
        message: includeKnowledgeFrom.length > 0 
          ? `${title} has been created with knowledge from ${includeKnowledgeFrom.length} project${includeKnowledgeFrom.length > 1 ? 's' : ''}!`
          : `${title} has been created successfully!`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    setTitle('');
    setDescription('');
    setIsShared(false);
    setIncludeKnowledgeFrom([]);
    onClose();
  };

  const toggleProjectSelection = (projectId) => {
    setIncludeKnowledgeFrom(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <InlineHint 
            message="Projects are your workspace for organizing knowledge. Add documents, chat with Billy, and generate courses all within a project."
            type="info"
          />

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project title..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your project..."
              required
            />
          </div>

          {state.projects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Knowledge From (Optional)
              </label>
              <InlineHint 
                message={HINTS.COMPOSE_FROM_PROJECTS}
                type="tip"
                className="mb-2"
              />
              <div className="relative">
                <HintTooltip hint="Select existing projects to copy their knowledge into this new project" position="top">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className="text-gray-700">
                      {includeKnowledgeFrom.length === 0 
                        ? 'Select projects to include knowledge from...'
                        : `${includeKnowledgeFrom.length} project${includeKnowledgeFrom.length > 1 ? 's' : ''} selected`
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </HintTooltip>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {state.projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => toggleProjectSelection(project.id)}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-3 ${
                          includeKnowledgeFrom.includes(project.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {includeKnowledgeFrom.includes(project.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{project.title}</p>
                          <p className="text-xs text-gray-600 truncate">
                            {project.mediaAssets.length} assets • {project.courses.length} courses
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {includeKnowledgeFrom.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Knowledge from selected projects will be copied to this new project
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shared"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="shared" className="ml-2 text-sm text-gray-700">
              Make this project shareable
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}