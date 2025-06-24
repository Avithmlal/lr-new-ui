import React, { useState } from 'react';
import { X, Brain, Plus, Minus, Target, Clock, Users, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function CreateKnowledgeGatherPlanModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetRole: '',
    estimatedDuration: 20,
    selectedProjects: [],
    selectedCourses: [],
    learningObjectives: [''],
    competencyAreas: [],
    maxAttempts: 3,
    passingCriteria: ['']
  });

  const handleSubmit = () => {
    const newPlan = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetRole: formData.targetRole,
      estimatedDuration: formData.estimatedDuration,
      sourceProjects: formData.selectedProjects,
      courses: formData.selectedCourses.map((course, index) => ({
        ...course,
        order: index + 1
      })),
      assessments: [], // Will be added later
      requirements: [],
      learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
      competencyAreas: formData.competencyAreas,
      isPublished: false, // Start as draft
      inviteOnly: true, // Always invitation-based
      maxAttempts: formData.maxAttempts,
      passingCriteria: formData.passingCriteria.filter(criteria => criteria.trim()),
      organizationId: '1',
      createdBy: 'current-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      enrollmentCount: 0,
      completionRate: 0,
      averageScore: 0
    };

    dispatch({ type: 'ADD_KNOWLEDGE_GATHER_PLAN', payload: newPlan });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Knowledge Gather Plan Created',
        message: `"${formData.title}" has been created as a draft. Publish it to start inviting users.`,
        timestamp: new Date(),
        isRead: false,
      }
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      targetRole: '',
      estimatedDuration: 20,
      selectedProjects: [],
      selectedCourses: [],
      learningObjectives: [''],
      competencyAreas: [],
      maxAttempts: 3,
      passingCriteria: ['']
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

  const addPassingCriteria = () => {
    setFormData(prev => ({
      ...prev,
      passingCriteria: [...prev.passingCriteria, '']
    }));
  };

  const removePassingCriteria = (index) => {
    setFormData(prev => ({
      ...prev,
      passingCriteria: prev.passingCriteria.filter((_, i) => i !== index)
    }));
  };

  const updatePassingCriteria = (index, value) => {
    setFormData(prev => ({
      ...prev,
      passingCriteria: prev.passingCriteria.map((criteria, i) => i === index ? value : criteria)
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior React Developer Knowledge Gathering"
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
                placeholder="Describe what knowledge will be gathered..."
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Knowledge Gather Plan Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Course content review and completion tracking</li>
                <li>• PDF document review from source projects</li>
                <li>• Interactive Q&A assessments with Billy AI</li>
                <li>• AI-based criteria evaluation (no pass scores)</li>
                <li>• Invitation-only enrollment system</li>
                <li>• Manager oversight and approval workflow</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Source Projects</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose the projects that contain the knowledge to be gathered. These projects should have been set up ahead of time with the relevant content.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Projects to Include as Sources</label>
              {state.projects.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
                  <p className="text-gray-600">You need to create projects with content first before setting up knowledge gather plans.</p>
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
                  <strong>Select at least one project</strong> to serve as the knowledge source for this gather plan.
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

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Learning Objectives & AI Criteria</h3>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">AI Evaluation Criteria (instead of pass scores)</label>
              <p className="text-sm text-gray-600 mb-3">
                Define criteria that Billy AI will check against during assessments. Each criterion will be evaluated as met/not met.
              </p>
              <div className="space-y-3">
                {formData.passingCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) => updatePassingCriteria(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Demonstrates deep understanding of React component lifecycle"
                    />
                    {formData.passingCriteria.length > 1 && (
                      <button
                        onClick={() => removePassingCriteria(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addPassingCriteria}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Criteria
                </button>
              </div>
            </div>

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

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Invitation-Based System</h4>
              <p className="text-sm text-green-800">
                This plan will be invitation-only. Only users specifically invited by managers can enroll. 
                You can publish/unpublish the plan to control availability.
              </p>
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
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Create Knowledge Gather Plan</h2>
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
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Source Projects</span>
            <span>Objectives & Criteria</span>
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
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 2 && formData.selectedProjects.length === 0}
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
                <Brain className="w-4 h-4 mr-2 inline" />
                Create Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}