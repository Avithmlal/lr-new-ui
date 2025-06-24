import React, { useState } from 'react';
import { Plus, Play, Clock, Users, Eye, Wand2, GraduationCap, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CourseGenerationModal } from '../components/Courses/CourseGenerationModal';
import { ProjectDropdown } from '../components/Common/ProjectDropdown';
import { Pagination } from '../components/Common/Pagination';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { InlineHint } from '../components/Guidance/InlineHint';
import { useApp } from '../contexts/AppContext';
import { HINTS } from '../constants/hints';

export function Courses() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(9);

  // Get all courses from all projects with project info
  const allCourses = state.projects.flatMap(project => 
    project.courses.map(course => ({
      ...course,
      projectTitle: project.title,
      projectId: project.id,
    }))
  );

  // Filter courses by selected projects
  const filteredCourses = selectedProjects.length > 0 
    ? allCourses.filter(course => selectedProjects.includes(course.projectId))
    : allCourses;

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'generating': return 'Generating';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/${course.id}?project=${course.projectId}`);
  };

  const handleGenerateCourse = () => {
    if (state.projects.length === 0) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'No Projects Available',
          message: 'Create a project first before generating courses.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }
    setIsGenerateModalOpen(true);
  };

  const handleProjectToggle = (projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSelectedProjects([]);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Generate and manage courses from your project knowledge</p>
        </div>
        <HintTooltip hint={HINTS.GENERATE_COURSE} position="bottom">
          <button 
            onClick={handleGenerateCourse}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Course
          </button>
        </HintTooltip>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Courses</h3>
          {selectedProjects.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProjectDropdown
            selectedProjects={selectedProjects}
            onProjectToggle={handleProjectToggle}
            multiple={true}
            placeholder="Filter by projects..."
            className="flex-1"
          />
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredCourses.length} of {allCourses.length} courses
              {selectedProjects.length > 0 && ` from ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {selectedProjects.length > 0 && (
          <InlineHint 
            message={`Showing courses from ${selectedProjects.length} selected project${selectedProjects.length > 1 ? 's' : ''}.`}
            type="info"
            className="mt-4"
          />
        )}
      </div>

      {allCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">
            Generate your first course from project knowledge
          </p>
          <button
            onClick={handleGenerateCourse}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Course
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">
            No courses match your current filter selection
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => (
              <HintTooltip 
                key={course.id}
                hint="Click to view course details and manage generation process"
                position="top"
              >
                <div 
                  onClick={() => handleViewCourse(course)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <GraduationCap className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-purple-800">{course.language}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors pr-2">
                        {course.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(course.status?.status || 'draft')}`}>
                        {getStatusText(course.status?.status || 'draft')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{course.objective}</p>
                    <p className="text-xs text-blue-600 mb-4 font-medium truncate">From: {course.projectTitle}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {course.sections?.length || 0} sections
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="truncate">{course.targetAudience || 'General'}</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.status?.progress || 0}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-lg group-hover:bg-purple-700 transition-colors group-hover:shadow-md text-sm font-medium">
                        <Eye className="w-4 h-4 mr-2" />
                        {course.status?.status === 'completed' ? 'View Course' : 'Continue Setup'}
                      </div>
                    </div>
                  </div>
                </div>
              </HintTooltip>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={coursesPerPage}
            totalItems={filteredCourses.length}
          />
        </>
      )}

      <CourseGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />
    </div>
  );
}