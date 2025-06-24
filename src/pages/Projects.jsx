import React, { useState } from 'react';
import { Plus, Search, Filter, Merge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { ProjectMergeModal } from '../components/Projects/ProjectMergeModal';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { InlineHint } from '../components/Guidance/InlineHint';
import { useApp } from '../contexts/AppContext';
import { useGuidance } from '../hooks/useGuidance';
import { HINTS } from '../constants/hints';

export function Projects() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { showTooltips, markStepCompleted } = useGuidance();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = state.projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (project) => {
    markStepCompleted('project_opened');
    navigate(`/projects/${project.id}`);
  };

  const handleCreateProject = () => {
    markStepCompleted('create_project_clicked');
    setIsCreateModalOpen(true);
  };

  const handleMergeProjects = () => {
    markStepCompleted('merge_projects_clicked');
    setIsMergeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your knowledge capture projects and merge related content</p>
        </div>
        <div className="flex space-x-3">
          <HintTooltip hint={HINTS.MERGE_PROJECTS} position="bottom">
            <button
              onClick={handleMergeProjects}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Merge className="w-4 h-4 mr-2" />
              Merge Projects
            </button>
          </HintTooltip>
          
          <HintTooltip hint={HINTS.CREATE_PROJECT} position="bottom">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </HintTooltip>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <HintTooltip hint={HINTS.SEARCH_PROJECTS} position="bottom">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </HintTooltip>
        <button className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {state.projects.length === 0 && (
        <InlineHint 
          message="Projects are your workspace for organizing knowledge. Create your first project to start uploading documents, chatting with Billy, and generating courses."
          type="tip"
          className="mb-4"
        />
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          <HintTooltip hint={HINTS.CREATE_PROJECT} position="top">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </HintTooltip>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <HintTooltip 
              key={project.id}
              hint="Click to open your project workspace where you can add content and generate courses"
              position="top"
            >
              <div>
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              </div>
            </HintTooltip>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ProjectMergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
      />
    </div>
  );
}