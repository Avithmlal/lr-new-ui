import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RefreshCw, 
  Users, 
  Clock, 
  Target, 
  BookOpen, 
  Play, 
  Edit3, 
  Settings,
  Award,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  User,
  Calendar
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function KnowledgeTransferPackageDetail() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the package in knowledgeGatherPlans
  const transferPackage = state.knowledgeGatherPlans?.find(p => p.id === packageId);
  
  // Initialize enrollments as an empty array if knowledgeTransferEnrollments doesn't exist
  const enrollments = state.knowledgeGatherEnrollments?.filter(e => e.planId === packageId) || [];

  if (!transferPackage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Package not found</h2>
        <button
          onClick={() => navigate('/knowledge-transfer')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Knowledge Transfer
        </button>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnroll = () => {
    const enrollment = {
      id: Date.now().toString(),
      planId: transferPackage.id,
      userId: 'current-user-id',
      status: 'enrolled',
      overallProgress: 0,
      currentPhase: 'courses',
      courseProgress: transferPackage.courses?.map(course => ({
        courseId: course.courseId,
        status: 'not_started',
        progress: 0,
        watchTime: 0
      })) || [],
      assessmentProgress: transferPackage.assessments?.map(assessment => ({
        assessmentId: assessment.id,
        attempts: [],
        bestScore: 0,
        status: 'not_started'
      })) || [],
      finalScore: 0,
      competencyScores: [],
      knowledgeGaps: [],
      recommendations: [],
      enrolledAt: new Date(),
      lastActivityAt: new Date()
    };

    dispatch({ type: 'ADD_KNOWLEDGE_GATHER_ENROLLMENT', payload: enrollment });
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Enrolled Successfully',
        message: 'You have been enrolled in the knowledge transfer package.',
        timestamp: new Date(),
        isRead: false,
      }
    });

    navigate(`/knowledge-transfer/enrollments/${enrollment.id}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Package Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-900 mt-1">{transferPackage.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Target Role</label>
                    <p className="text-gray-900 mt-1">{transferPackage.targetRole}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Difficulty</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getDifficultyColor(transferPackage.difficulty || 'intermediate')}`}>
                      {transferPackage.difficulty || 'INTERMEDIATE'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Duration</label>
                    <p className="text-gray-900 mt-1">{transferPackage.estimatedDuration} hours</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Passing Score</label>
                    <p className="text-gray-900 mt-1">{transferPackage.passingScore || 75}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Max Attempts</label>
                    <p className="text-gray-900 mt-1">{transferPackage.maxAttempts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Employee */}
            {transferPackage.sourceEmployee && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Employee</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{transferPackage.sourceEmployee.name}</h4>
                    <p className="text-gray-600">{transferPackage.sourceEmployee.role}</p>
                    <p className="text-sm text-gray-500">{transferPackage.sourceEmployee.department}</p>
                    {transferPackage.sourceEmployee.email && (
                      <p className="text-sm text-blue-600">{transferPackage.sourceEmployee.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Objectives */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
              <ul className="space-y-2">
                {transferPackage.learningObjectives?.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                )) || []}
              </ul>
            </div>

            {/* Competency Areas */}
            {transferPackage.competencyAreas && transferPackage.competencyAreas.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Areas</h3>
                <div className="space-y-4">
                  {transferPackage.competencyAreas.map((competency) => (
                    <div key={competency.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{competency.name}</h4>
                        <span className="text-sm text-gray-600">{competency.weight}% weight</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{competency.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {competency.subCompetencies?.map((sub, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {sub}
                          </span>
                        )) || []}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {/* Projects */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Included Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transferPackage.sourceProjects?.map((projectId) => {
                  const project = state.projects?.find(p => p.id === projectId);
                  if (!project) return null;
                  
                  return (
                    <div key={projectId} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{project.mediaAssets?.length || 0} assets</span>
                        <span>{project.courses?.length || 0} courses</span>
                      </div>
                    </div>
                  );
                }) || []}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Courses</h3>
              <div className="space-y-4">
                {transferPackage.courses?.map((courseConfig) => {
                  const course = state.projects
                    ?.flatMap(p => p.courses || [])
                    .find(c => c.id === courseConfig.courseId);
                  
                  if (!course) return null;
                  
                  return (
                    <div key={courseConfig.courseId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{course.objective}</p>
                        </div>
                        <div className="flex space-x-2">
                          {courseConfig.isRequired && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                          {courseConfig.mustWatchFully && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              Must Watch Fully
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{course.sections?.length || 0} sections</span>
                        <span>{course.language}</span>
                        {courseConfig.minimumScore && (
                          <span>Min. score: {courseConfig.minimumScore}%</span>
                        )}
                      </div>
                    </div>
                  );
                }) || []}
              </div>
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{transferPackage.assessments?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {transferPackage.assessments?.reduce((acc, a) => acc + a.estimatedDuration, 0) || 0}m
                  </p>
                  <p className="text-sm text-gray-600">Total Duration</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{transferPackage.passingScore || 75}%</p>
                  <p className="text-sm text-gray-600">Passing Score</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {transferPackage.assessments?.map((assessment) => (
                <div key={assessment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{assessment.title}</h4>
                      <p className="text-gray-600 mt-1">{assessment.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize">
                        {assessment.type?.replace('_', ' ')}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 capitalize">
                        {assessment.interactionMode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-gray-900">{assessment.estimatedDuration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Max Attempts</p>
                      <p className="text-gray-900">{assessment.maxAttempts}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Passing Score</p>
                      <p className="text-gray-900">{assessment.passingScore || 75}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Billy Mode</p>
                      <p className="text-gray-900 capitalize">{assessment.billyPersonality}</p>
                    </div>
                  </div>

                  {assessment.questions && assessment.questions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Sample Questions</h5>
                      <div className="space-y-2">
                        {assessment.questions.slice(0, 2).map((question) => (
                          <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{question.question}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {question.competencyArea}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                                {question.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )) || []}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-900">{transferPackage.enrollmentCount || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{transferPackage.completionRate || 0}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{transferPackage.averageScore || 0}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Learners</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollments.filter(e => e.status === 'in_progress').length}</p>
                  </div>
                  <Play className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Analytics chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'enrollments':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Current Enrollments</h3>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="p-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                  <p className="text-gray-600">This package hasn't been enrolled in by anyone yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Learner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">User {enrollment.userId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              enrollment.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.overallProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{enrollment.overallProgress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.finalScore || 0}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.enrolledAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/knowledge-transfer')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{transferPackage.title}</h1>
              <p className="text-gray-600">Knowledge Transfer Package</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            transferPackage.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {transferPackage.isPublished ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={handleEnroll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2 inline" />
            Enroll Now
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-xl font-bold text-gray-900">{transferPackage.estimatedDuration}h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-xl font-bold text-gray-900">{transferPackage.courses?.length || 0}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assessments</p>
              <p className="text-xl font-bold text-gray-900">{transferPackage.assessments?.length || 0}</p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled</p>
              <p className="text-xl font-bold text-gray-900">{transferPackage.enrollmentCount || 0}</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900">{transferPackage.completionRate || 0}%</p>
            </div>
            <Award className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'content', label: 'Content' },
            { id: 'assessments', label: 'Assessments' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'enrollments', label: 'Enrollments', count: enrollments.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}