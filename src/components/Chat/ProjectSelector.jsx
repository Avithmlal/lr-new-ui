import React, { useState } from 'react';
import { Check, FolderOpen, Plus, Search, ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { HintTooltip } from '../Guidance/HintTooltip';
import { InlineHint } from '../Guidance/InlineHint';
import { HINTS } from '../../constants/hints';

export function ProjectSelector({ selectedProjects, onProjectToggle, onCreateProject }) {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredProjects = state.projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Projects</h3>
        <HintTooltip hint={HINTS.CREATE_PROJECT} position="left">
          <button
            onClick={onCreateProject}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </button>
        </HintTooltip>
      </div>

      <InlineHint 
        message={HINTS.PROJECT_SELECTION}
        type="info"
        className="mb-4"
      />

      {state.projects.length > 3 && (
        <div className="mb-4">
          <HintTooltip hint={HINTS.SEARCH_PROJECTS} position="bottom">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </HintTooltip>
        </div>
      )}
      
      <div className="space-y-2">
        {displayedProjects.map((project) => (
          <HintTooltip 
            key={project.id}
            hint="Click to select this project for knowledge capture"
            position="right"
          >
            <div
              onClick={() => onProjectToggle(project.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedProjects.includes(project.id)
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedProjects.includes(project.id) ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  {selectedProjects.includes(project.id) ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{project.title}</p>
                  <p className="text-sm text-gray-600 truncate">{project.description}</p>
                </div>
              </div>
            </div>
          </HintTooltip>
        ))}

        {filteredProjects.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center p-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="mr-1">
              {isExpanded ? 'Show Less' : `Show ${filteredProjects.length - 3} More`}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
        
        {state.projects.length === 0 && (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">No projects yet</p>
            <HintTooltip hint={HINTS.CREATE_PROJECT} position="top">
              <button
                onClick={onCreateProject}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </button>
            </HintTooltip>
          </div>
        )}
      </div>
      
      {selectedProjects.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{selectedProjects.length}</span> project{selectedProjects.length > 1 ? 's' : ''} selected
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Knowledge will be captured and added to selected projects
          </p>
        </div>
      )}
    </div>
  );
}