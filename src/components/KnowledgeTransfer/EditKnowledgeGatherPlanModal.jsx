import React, { useState, useEffect } from 'react';
import { X, Brain, Plus, Minus, Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function EditKnowledgeGatherPlanModal({ isOpen, onClose, plan }) {
  const { state, dispatch } = useApp();
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

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        description: plan.description,
        targetRole: plan.targetRole,
        estimatedDuration: plan.estimatedDuration,
        selectedProjects: plan.sourceProjects,
        selectedCourses: plan.courses,
        learningObjectives: plan.learningObjectives.length > 0 ? plan.learningObjectives : [''],
        competencyAreas: plan.competencyAreas,
        maxAttempts: plan.maxAttempts,
        passingCriteria: plan.passingCriteria.length > 0 ? plan.passingCriteria : ['']
      });
    }
  }, [plan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedPlan = {
      ...plan,
      title: formData.title,
      description: formData.description,
      targetRole: formData.targetRole,
      estimatedDuration: formData.estimatedDuration,
      sourceProjects: formData.selectedProjects,
      courses: formData.selectedCourses.map((course, index) => ({
        ...course,
        order: index + 1
      })),
      learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
      competencyAreas: formData.competencyAreas,
      maxAttempts: formData.maxAttempts,
      passingCriteria: formData.passingCriteria.filter(criteria => criteria.trim()),
      updatedAt: new Date()
    };

    dispatch({ type: 'UPDATE_KNOWLEDGE_GATHER_PLAN', payload: updatedPlan });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Plan Updated',
        message: `"${formData.title}" has been updated successfully.`,
        timestamp: new Date(),
        isRead: false,
      }
    });

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Knowledge Gather Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          {/* Source Projects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Source Projects</h3>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses */}
          {availableCourses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Courses to Include</h3>
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

          {/* Learning Objectives */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
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
                      type="button"
                      onClick={() => removeLearningObjective(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLearningObjective}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Objective
              </button>
            </div>
          </div>

          {/* AI Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Evaluation Criteria</h3>
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
                      type="button"
                      onClick={() => removePassingCriteria(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPassingCriteria}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Criteria
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
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
          </div>
        </form>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}