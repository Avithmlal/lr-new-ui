import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Mic,
  Video,
  BarChart3,
  Award,
  BookOpen,
  TrendingUp,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function KnowledgeTransferEnrollmentDetail() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock enrollment data with detailed progress
  const enrollment = {
    id: enrollmentId || '1',
    packageId: '1',
    packageTitle: 'Senior Developer Knowledge Transfer',
    learnerName: 'John Smith',
    learnerEmail: 'john.smith@company.com',
    enrolledAt: new Date('2024-01-15'),
    status: 'in_progress',
    progress: 65,
    currentPhase: 'assessments',
    completedCourses: 3,
    totalCourses: 5,
    completedAssessments: 2,
    totalAssessments: 4,
    overallScore: 78,
    estimatedCompletion: new Date('2024-02-15'),
    courseProgress: [
      { id: '1', title: 'React Fundamentals', status: 'completed', progress: 100, score: 85, completedAt: new Date('2024-01-18') },
      { id: '2', title: 'Advanced Patterns', status: 'completed', progress: 100, score: 92, completedAt: new Date('2024-01-22') },
      { id: '3', title: 'State Management', status: 'completed', progress: 100, score: 78, completedAt: new Date('2024-01-25') },
      { id: '4', title: 'Testing Strategies', status: 'in_progress', progress: 60, score: 0 },
      { id: '5', title: 'Performance Optimization', status: 'not_started', progress: 0, score: 0 },
    ],
    assessmentProgress: [
      { 
        id: '1', 
        title: 'React Architecture Assessment', 
        status: 'completed', 
        score: 88, 
        attempts: 1,
        completedAt: new Date('2024-01-20'),
        feedback: 'Excellent understanding of component architecture and state management patterns.'
      },
      { 
        id: '2', 
        title: 'Code Review Simulation', 
        status: 'completed', 
        score: 75, 
        attempts: 2,
        completedAt: new Date('2024-01-26'),
        feedback: 'Good technical knowledge, could improve communication of feedback.'
      },
      { 
        id: '3', 
        title: 'System Design Challenge', 
        status: 'in_progress', 
        score: 0, 
        attempts: 0
      },
      { 
        id: '4', 
        title: 'Leadership Scenario', 
        status: 'not_started', 
        score: 0, 
        attempts: 0
      },
    ],
    knowledgeGaps: [
      {
        area: 'Performance Optimization',
        severity: 'medium',
        description: 'Limited understanding of React performance optimization techniques',
        recommendations: ['Complete Performance Optimization course', 'Practice with React DevTools']
      },
      {
        area: 'Team Leadership',
        severity: 'low',
        description: 'Could improve mentoring and code review communication',
        recommendations: ['Focus on constructive feedback techniques', 'Practice explaining complex concepts']
      }
    ],
    competencyScores: [
      { area: 'Technical Knowledge', score: 85, target: 80 },
      { area: 'Problem Solving', score: 82, target: 75 },
      { area: 'Code Quality', score: 78, target: 80 },
      { area: 'Communication', score: 72, target: 75 },
      { area: 'Leadership', score: 65, target: 70 },
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'failed': return XCircle;
      case 'not_started': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/knowledge-transfer/assessments/${assessmentId}`);
  };

  const handleResumeLearning = () => {
    const nextCourse = enrollment.courseProgress.find(c => c.status === 'in_progress');
    if (nextCourse) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Resuming Learning',
          message: `Continuing with "${nextCourse.title}"...`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollment.progress}%</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollment.completedCourses}/{enrollment.totalCourses}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollment.completedAssessments}/{enrollment.totalAssessments}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Score</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollment.overallScore}%</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Learner Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{enrollment.learnerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{enrollment.learnerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Phase</label>
                    <p className="text-gray-900 capitalize">{enrollment.currentPhase.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Enrolled Date</label>
                    <p className="text-gray-900">{enrollment.enrolledAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Completion</label>
                    <p className="text-gray-900">{enrollment.estimatedCompletion.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={handleResumeLearning}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Resume Learning</span>
                </button>
                
                <button 
                  onClick={() => handleStartAssessment('3')}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Start Assessment</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('progress')}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">View Progress</span>
                </button>
                
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Reset Progress</span>
                </button>
              </div>
            </div>

            {/* Knowledge Gaps */}
            {enrollment.knowledgeGaps.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Knowledge Gaps Analysis
                </h3>
                <div className="space-y-4">
                  {enrollment.knowledgeGaps.map((gap, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{gap.area}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                          {gap.severity} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {gap.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-start">
                              <Lightbulb className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            {/* Competency Scores */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Assessment</h3>
              <div className="space-y-4">
                {enrollment.competencyScores.map((competency, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{competency.area}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{competency.score}%</span>
                        <span className="text-xs text-gray-500">Target: {competency.target}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          competency.score >= competency.target ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${competency.score}%` }}
                      ></div>
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-gray-400"
                        style={{ left: `${competency.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
              <div className="space-y-4">
                {enrollment.courseProgress.map((course) => {
                  const StatusIcon = getStatusIcon(course.status);
                  return (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`w-5 h-5 ${
                            course.status === 'completed' ? 'text-green-600' :
                            course.status === 'in_progress' ? 'text-blue-600' :
                            'text-gray-400'
                          }`} />
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                            {course.status.replace('_', ' ')}
                          </span>
                          {course.score > 0 && (
                            <span className="text-sm font-medium text-gray-900">{course.score}%</span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{course.progress}% complete</span>
                        {course.completedAt && (
                          <span>Completed: {course.completedAt.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Results</h3>
              <div className="space-y-4">
                {enrollment.assessmentProgress.map((assessment) => {
                  const StatusIcon = getStatusIcon(assessment.status);
                  return (
                    <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`w-5 h-5 ${
                            assessment.status === 'completed' ? 'text-green-600' :
                            assessment.status === 'in_progress' ? 'text-blue-600' :
                            'text-gray-400'
                          }`} />
                          <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                            {assessment.status.replace('_', ' ')}
                          </span>
                          {assessment.score > 0 && (
                            <span className="text-sm font-medium text-gray-900">{assessment.score}%</span>
                          )}
                        </div>
                      </div>
                      
                      {assessment.status === 'completed' && assessment.feedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-blue-800">{assessment.feedback}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Attempts: {assessment.attempts}</span>
                        {assessment.completedAt && (
                          <span>Completed: {assessment.completedAt.toLocaleDateString()}</span>
                        )}
                        {assessment.status === 'not_started' && (
                          <button
                            onClick={() => handleStartAssessment(assessment.id)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Start Assessment
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'conversations':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billy Conversation History</h3>
              <div className="space-y-4">
                {/* Mock conversation sessions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">React Architecture Assessment</h4>
                    </div>
                    <span className="text-sm text-gray-600">Jan 20, 2024</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">45-minute technical discussion about React patterns and best practices</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">Score: 88%</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Transcript
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Code Review Simulation</h4>
                    </div>
                    <span className="text-sm text-gray-600">Jan 26, 2024</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Voice-based code review session with feedback scenarios</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-600 font-medium">Score: 75%</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Listen to Recording
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-gray-900">System Design Challenge</h4>
                    </div>
                    <span className="text-sm text-gray-600">Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Upcoming video assessment for system architecture design</p>
                  <button
                    onClick={() => handleStartAssessment('3')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
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
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{enrollment.learnerName}</h1>
              <p className="text-gray-600">{enrollment.packageTitle}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
            {enrollment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'progress', label: 'Progress' },
            { id: 'assessments', label: 'Assessments' },
            { id: 'conversations', label: 'Conversations' },
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
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}