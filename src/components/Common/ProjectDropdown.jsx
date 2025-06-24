import React, { useState } from 'react';
import { ChevronDown, Search, FolderOpen, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function ProjectDropdown({ 
  selectedProjects, 
  onProjectToggle, 
  onCreateProject,
  multiple = true,
  placeholder = "Select projects...",
  className = ""
}) {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = state.projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProjectNames = selectedProjects
    .map(id => state.projects.find(p => p.id === id)?.title)
    .filter(Boolean);

  const displayText = selectedProjects.length === 0 
    ? placeholder
    : multiple 
      ? `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`
      : selectedProjectNames[0] || placeholder;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className={`truncate pr-2 ${selectedProjects.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Project List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'No matches' : 'No projects'}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    onProjectToggle(project.id);
                    if (!multiple) setIsOpen(false);
                  }}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedProjects.includes(project.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedProjects.includes(project.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedProjects.includes(project.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm">{project.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {project.mediaAssets.length} assets • {project.courses.length} courses
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create Project Option */}
          {onCreateProject && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => {
                  onCreateProject();
                  setIsOpen(false);
                }}
                className="w-full flex items-center p-3 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Create New Project</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}