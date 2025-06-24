import React, { useState } from 'react';
import { X, RefreshCw, Plus, Minus, Target, Clock, Users, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function CreateKnowledgeTransferModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceEmployee: {
      name: '',
      role: '',
      department: '',
      email: ''
    },
    targetRole: '',
    estimatedDuration: 20,
    difficulty: 'intermediate',
    selectedProjects: [],
    selectedCourses: [],
    learningObjectives: [''],
    competencyAreas: [],
    allowSelfEnrollment: true,
    maxAttempts: 3,
    passingScore: 75
  });

  const handleSubmit = () => {
    const newPackage = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      sourceEmployee: formData.sourceEmployee,
      targetRole: formData.targetRole,
      estimatedDuration: formData.estimatedDuration,
      difficulty: formData.difficulty,
      projects: formData.selectedProjects,
      courses: formData.selectedCourses.map((course, index) => ({
        ...course,
        order: index + 1
      })),
      assessments: [], // Will be added later
      requirements: [],
      learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
      competencyAreas: formData.competencyAreas,
      isActive: true,
      allowSelfEnrollment: formData.allowSelfEnrollment,
      maxAttempts: formData.maxAttempts,
      passingScore: formData.passingScore,
      organizationId: '1',
      createdBy: 'current-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      enrollmentCount: 0,
      completionRate: 0,
      averageScore: 0
    };

    dispatch({ type: 'ADD_KNOWLEDGE_TRANSFER_PACKAGE', payload: newPackage });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Knowledge Transfer Package Created',
        message: `"${formData.title}" has been created successfully.`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      sourceEmployee: { name: '', role: '', department: '', email: '' },
      targetRole: '',
      estimatedDuration: 20,
      difficulty: 'intermediate',
      selectedProjects: [],
      selectedCourses: [],
      learningObjectives: [''],
      competencyAreas: [],
      allowSelfEnrollment: true,
      maxAttempts: 3,
      passingScore: 75
    });
    setCurrentStep(1);
    onClose();
  };

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const removeLearningObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const updateLearningObjective = (index, value) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const toggleProjectSelection = (projectId) => {
    setFormData(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }));
  };

  const toggleCourseSelection = (courseId) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.find(c => c.courseId === courseId)
        ? prev.selectedCourses.filter(c => c.courseId !== courseId)
        : [...prev.selectedCourses, { courseId, isRequired: true, mustWatchFully: false }]
    }));
  };

  const updateCourseSettings = (courseId, settings) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.map(course =>
        course.courseId === courseId ? { ...course, ...settings } : course
      )
    }));
  };

  // Get all courses from selected projects
  const availableCourses = state.projects
    .filter(project => formData.selectedProjects.includes(project.id))
    .flatMap(project => project.courses.map(course => ({ ...course, projectTitle: project.title })));

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior React Developer Knowledge Transfer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what knowledge will be transferred..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., React Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (hours)</label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="200"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Source Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can optionally specify the source employee whose knowledge is being transferred. This is for reference purposes only.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name (Optional)</label>
                <input
                  type="text"
                  value={formData.sourceEmployee.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    sourceEmployee: { ...prev.sourceEmployee, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sarah Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title (Optional)</label>
                <input
                  type="text"
                  value={formData.sourceEmployee.role}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    sourceEmployee: { ...prev.sourceEmployee, role: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior React Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label>
                <input
                  type="text"
                  value={formData.sourceEmployee.department}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    sourceEmployee: { ...prev.sourceEmployee, department: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.sourceEmployee.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    sourceEmployee: { ...prev.sourceEmployee, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="sarah.chen@company.com"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The knowledge sources will be defined by the projects you select in the next step. 
                Source employee information is optional and used only for documentation purposes.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Knowledge Sources</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose the projects that contain the knowledge to be transferred. These projects should have been set up ahead of time with the relevant content.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Projects to Include as Sources</label>
              {state.projects.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
                  <p className="text-gray-600">You need to create projects with content first before setting up knowledge transfer packages.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {state.projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => toggleProjectSelection(project.id)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.selectedProjects.includes(project.id)
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          formData.selectedProjects.includes(project.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {formData.selectedProjects.includes(project.id) && (
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
              )}
            </div>

            {formData.selectedProjects.length === 0 && state.projects.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Select at least one project</strong> to serve as the knowledge source for this transfer package.
                </p>
              </div>
            )}

            {availableCourses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Courses to Include</label>
                <div className="space-y-3">
                  {availableCourses.map((course) => {
                    const isSelected = formData.selectedCourses.find(c => c.courseId === course.id);
                    return (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div
                              onClick={() => toggleCourseSelection(course.id)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer ${
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.objective}</p>
                              <p className="text-xs text-blue-600 mt-1">From: {course.projectTitle}</p>
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="ml-9 space-y-2">
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={isSelected.isRequired}
                                  onChange={(e) => updateCourseSettings(course.id, { isRequired: e.target.checked })}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                />
                                Required
                              </label>
                              <label className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={isSelected.mustWatchFully}
                                  onChange={(e) => updateCourseSettings(course.id, { mustWatchFully: e.target.checked })}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                                />
                                Must watch fully
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Learning Objectives & Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">What should learners achieve?</label>
              <div className="space-y-3">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter learning objective..."
                    />
                    {formData.learningObjectives.length > 1 && (
                      <button
                        onClick={() => removeLearningObjective(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addLearningObjective}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Objective
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
                <input
                  type="number"
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="50"
                  max="100"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="selfEnrollment"
                checked={formData.allowSelfEnrollment}
                onChange={(e) => setFormData(prev => ({ ...prev, allowSelfEnrollment: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="selfEnrollment" className="ml-2 text-sm text-gray-700">
                Allow self-enrollment
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create Knowledge Transfer Package</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Source Info</span>
            <span>Knowledge Sources</span>
            <span>Objectives</span>
          </div>
        </div>
        
        <div className="p-6">
          {renderStep()}
        </div>
        
        <div className="flex justify-between space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 3 && formData.selectedProjects.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.title || !formData.description || formData.selectedProjects.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4 mr-2 inline" />
                Create Package
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}