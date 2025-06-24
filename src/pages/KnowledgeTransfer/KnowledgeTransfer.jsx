import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Brain, Users, Clock, Target, BookOpen, Play, Eye, Edit3, Trash2, Award, UserPlus, ToggleLeft, ToggleRight, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Pagination } from '../../components/Common/Pagination';
import { CreateKnowledgeGatherPlanModal } from '../../components/KnowledgeTransfer/CreateKnowledgeGatherPlanModal';
import { EditKnowledgeGatherPlanModal } from '../../components/KnowledgeTransfer/EditKnowledgeGatherPlanModal';
import { DeleteConfirmationModal } from '../../components/Common/DeleteConfirmationModal';
import { InviteUserModal } from '../../components/KnowledgeTransfer/InviteUserModal';

export function KnowledgeTransfer() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');
  
  // Plans state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plansSearchTerm, setPlansSearchTerm] = useState('');
  const [plansStatusFilter, setPlansStatusFilter] = useState('all');
  const [plansRoleFilter, setPlansRoleFilter] = useState('all');
  const [plansSortBy, setPlansSortBy] = useState('updated');
  const [plansSortOrder, setPlansSortOrder] = useState('desc');
  const [plansCurrentPage, setPlansCurrentPage] = useState(1);
  const [plansPerPage] = useState(9);

  // Enrollments state
  const [enrollmentsSearchTerm, setEnrollmentsSearchTerm] = useState('');
  const [enrollmentsStatusFilter, setEnrollmentsStatusFilter] = useState('all');
  const [enrollmentsPlanFilter, setEnrollmentsPlanFilter] = useState('all');
  const [enrollmentsSortBy, setEnrollmentsSortBy] = useState('enrolled');
  const [enrollmentsSortOrder, setEnrollmentsSortOrder] = useState('desc');
  const [enrollmentsCurrentPage, setEnrollmentsCurrentPage] = useState(1);
  const [enrollmentsPerPage] = useState(10);

  useEffect(() => {
    // Initialize with sample knowledge gather plans
    if (state.knowledgeGatherPlans.length === 0) {
      const samplePlans = [
        {
          id: '1',
          title: 'Senior React Developer Knowledge Gathering',
          description: 'Comprehensive knowledge gathering plan for senior React developer expertise including advanced patterns, architecture decisions, and team leadership skills.',
          targetRole: 'React Developer',
          estimatedDuration: 40,
          sourceProjects: ['1', '2'],
          courses: [
            { courseId: '1', isRequired: true, mustWatchFully: true, order: 1 },
            { courseId: '2', isRequired: true, mustWatchFully: false, minimumScore: 80, order: 2 }
          ],
          assessments: [
            {
              id: 'assessment-1',
              title: 'React Architecture Assessment',
              type: 'qa_session',
              description: 'Interactive Q&A session with Billy to evaluate understanding of React architecture patterns',
              interactionMode: 'chat',
              estimatedDuration: 45,
              maxAttempts: 3,
              questions: [
                {
                  id: 'q1',
                  question: 'Explain the difference between controlled and uncontrolled components in React',
                  type: 'explanation',
                  competencyArea: 'React Fundamentals',
                  difficulty: 'medium',
                  expectedKeywords: ['controlled', 'uncontrolled', 'state', 'props', 'ref']
                }
              ],
              scenarios: [],
              evaluationCriteria: [
                {
                  id: 'criteria-1',
                  criterion: 'Technical Accuracy',
                  weight: 40,
                  description: 'Correctness of technical explanations',
                  rubric: {
                    excellent: 'Perfect technical accuracy with deep understanding',
                    good: 'Mostly accurate with minor gaps',
                    satisfactory: 'Basic accuracy with some misconceptions',
                    needsImprovement: 'Significant technical errors'
                  }
                }
              ],
              billyPersonality: 'interviewer',
              adaptiveDifficulty: true,
              isRequired: true,
              order: 1
            }
          ],
          requirements: [
            {
              id: 'req-1',
              type: 'prerequisite',
              description: 'Must have completed JavaScript Fundamentals course',
              isStrict: true
            }
          ],
          learningObjectives: [
            'Master advanced React patterns and best practices',
            'Understand component architecture and design decisions',
            'Develop skills in code review and mentoring'
          ],
          competencyAreas: [
            {
              id: 'comp-1',
              name: 'React Architecture',
              description: 'Understanding of React component architecture and patterns',
              weight: 30,
              subCompetencies: ['Component Design', 'State Management', 'Performance Optimization']
            }
          ],
          isPublished: true,
          inviteOnly: true,
          maxAttempts: 3,
          passingCriteria: [
            'Demonstrates deep understanding of React component lifecycle',
            'Can explain state management patterns clearly',
            'Shows ability to mentor junior developers',
            'Understands performance optimization techniques'
          ],
          organizationId: '1',
          createdBy: 'manager-1',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          enrollmentCount: 5,
          completionRate: 60,
          averageScore: 78
        },
        {
          id: '2',
          title: 'Product Management Essentials',
          description: 'Essential product management knowledge including user research, roadmap planning, and stakeholder communication.',
          targetRole: 'Product Manager',
          estimatedDuration: 25,
          sourceProjects: ['3'],
          courses: [
            { courseId: '3', isRequired: true, mustWatchFully: true, order: 1 }
          ],
          assessments: [
            {
              id: 'assessment-2',
              title: 'Product Strategy Assessment',
              type: 'scenario_based',
              description: 'Scenario-based assessment with Billy for product strategy and decision-making skills',
              interactionMode: 'voice',
              estimatedDuration: 60,
              maxAttempts: 2,
              questions: [],
              scenarios: [
                {
                  id: 'scenario-1',
                  title: 'Feature Prioritization Challenge',
                  description: 'You have limited development resources and multiple feature requests',
                  context: 'Q4 planning with competing stakeholder demands',
                  expectedActions: ['Analyze user impact', 'Consider technical complexity', 'Align with business goals'],
                  evaluationPoints: ['Prioritization framework', 'Stakeholder communication', 'Data-driven decisions']
                }
              ],
              evaluationCriteria: [
                {
                  id: 'criteria-2',
                  criterion: 'Strategic Thinking',
                  weight: 50,
                  description: 'Ability to think strategically about product decisions',
                  rubric: {
                    excellent: 'Demonstrates exceptional strategic thinking',
                    good: 'Shows good strategic understanding',
                    satisfactory: 'Basic strategic awareness',
                    needsImprovement: 'Limited strategic thinking'
                  }
                }
              ],
              billyPersonality: 'mentor',
              adaptiveDifficulty: false,
              isRequired: true,
              order: 1
            }
          ],
          requirements: [],
          learningObjectives: [
            'Understand product strategy and roadmap planning',
            'Master user research and data analysis techniques',
            'Develop stakeholder communication skills'
          ],
          competencyAreas: [
            {
              id: 'comp-2',
              name: 'Product Strategy',
              description: 'Strategic thinking and planning for product development',
              weight: 40,
              subCompetencies: ['Market Analysis', 'Roadmap Planning', 'Feature Prioritization']
            }
          ],
          isPublished: false,
          inviteOnly: true,
          maxAttempts: 2,
          passingCriteria: [
            'Can create effective product roadmaps',
            'Demonstrates user-centric thinking',
            'Shows strong stakeholder communication skills'
          ],
          organizationId: '1',
          createdBy: 'manager-2',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          enrollmentCount: 12,
          completionRate: 75,
          averageScore: 82
        },
        // Add more sample plans for pagination testing
        ...Array.from({ length: 20 }, (_, i) => ({
          id: `plan-${i + 3}`,
          title: `Knowledge Plan ${i + 3}`,
          description: `Sample knowledge gathering plan ${i + 3} for testing pagination and filtering.`,
          targetRole: ['Developer', 'Manager', 'Designer', 'Analyst'][i % 4],
          estimatedDuration: Math.floor(Math.random() * 50) + 10,
          sourceProjects: ['1'],
          courses: [],
          assessments: [],
          requirements: [],
          learningObjectives: [`Objective ${i + 1}`],
          competencyAreas: [],
          isPublished: Math.random() > 0.5,
          inviteOnly: true,
          maxAttempts: 3,
          passingCriteria: [`Criteria ${i + 1}`],
          organizationId: '1',
          createdBy: 'manager-1',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          enrollmentCount: Math.floor(Math.random() * 20),
          completionRate: Math.floor(Math.random() * 100),
          averageScore: Math.floor(Math.random() * 40) + 60
        }))
      ];

      dispatch({ type: 'SET_KNOWLEDGE_GATHER_PLANS', payload: samplePlans });

      // Initialize sample enrollments
      const sampleEnrollments = Array.from({ length: 15 }, (_, i) => ({
        id: `enrollment-${i + 1}`,
        planId: samplePlans[i % samplePlans.length].id,
        userId: `user-${i + 1}`,
        invitedBy: 'manager-1',
        invitedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        invitationAcceptedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : undefined,
        status: ['invited', 'enrolled', 'in_progress', 'completed', 'failed'][Math.floor(Math.random() * 5)],
        overallProgress: Math.floor(Math.random() * 100),
        currentPhase: ['courses', 'pdf_review', 'assessments', 'final_evaluation'][Math.floor(Math.random() * 4)],
        courseProgress: [],
        pdfReviewProgress: [],
        assessmentProgress: [],
        criteriaEvaluation: [],
        knowledgeGaps: [],
        recommendations: [],
        enrolledAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
        lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }));

      dispatch({ type: 'SET_KNOWLEDGE_GATHER_ENROLLMENTS', payload: sampleEnrollments });
    }
  }, [state.knowledgeGatherPlans.length, dispatch]);

  // Get unique target roles for filtering
  const uniqueRoles = [...new Set(state.knowledgeGatherPlans.map(plan => plan.targetRole))];

  // Filter and sort plans
  const getFilteredAndSortedPlans = () => {
    let filtered = state.knowledgeGatherPlans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(plansSearchTerm.toLowerCase()) ||
                           plan.description.toLowerCase().includes(plansSearchTerm.toLowerCase()) ||
                           plan.targetRole.toLowerCase().includes(plansSearchTerm.toLowerCase());
      const matchesStatus = plansStatusFilter === 'all' || 
                           (plansStatusFilter === 'published' && plan.isPublished) ||
                           (plansStatusFilter === 'unpublished' && !plan.isPublished);
      const matchesRole = plansRoleFilter === 'all' || plan.targetRole === plansRoleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort plans
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (plansSortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'created':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updated':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'enrollments':
          aValue = a.enrollmentCount;
          bValue = b.enrollmentCount;
          break;
        default:
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
      }

      if (plansSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Filter and sort enrollments
  const getFilteredAndSortedEnrollments = () => {
    let filtered = state.knowledgeGatherEnrollments.filter(enrollment => {
      const plan = state.knowledgeGatherPlans.find(p => p.id === enrollment.planId);
      const matchesSearch = plan?.title.toLowerCase().includes(enrollmentsSearchTerm.toLowerCase()) ||
                           enrollment.userId.toLowerCase().includes(enrollmentsSearchTerm.toLowerCase());
      const matchesStatus = enrollmentsStatusFilter === 'all' || enrollment.status === enrollmentsStatusFilter;
      const matchesPlan = enrollmentsPlanFilter === 'all' || enrollment.planId === enrollmentsPlanFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });

    // Sort enrollments
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (enrollmentsSortBy) {
        case 'enrolled':
          aValue = a.enrolledAt.getTime();
          bValue = b.enrolledAt.getTime();
          break;
        case 'progress':
          aValue = a.overallProgress;
          bValue = b.overallProgress;
          break;
        case 'score':
          // Mock score calculation
          aValue = Math.random() * 100;
          bValue = Math.random() * 100;
          break;
        default:
          aValue = a.enrolledAt.getTime();
          bValue = b.enrolledAt.getTime();
      }

      if (enrollmentsSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredPlans = getFilteredAndSortedPlans();
  const filteredEnrollments = getFilteredAndSortedEnrollments();

  // Pagination for plans
  const plansTotalPages = Math.ceil(filteredPlans.length / plansPerPage);
  const plansStartIndex = (plansCurrentPage - 1) * plansPerPage;
  const paginatedPlans = filteredPlans.slice(plansStartIndex, plansStartIndex + plansPerPage);

  // Pagination for enrollments
  const enrollmentsTotalPages = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);
  const enrollmentsStartIndex = (enrollmentsCurrentPage - 1) * enrollmentsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(enrollmentsStartIndex, enrollmentsStartIndex + enrollmentsPerPage);

  const handleViewPlan = (planId) => {
    navigate(`/knowledge-transfer/packages/${planId}`);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlan = () => {
    if (selectedPlan) {
      dispatch({ type: 'DELETE_KNOWLEDGE_GATHER_PLAN', payload: selectedPlan.id });
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: 'Plan Deleted',
          message: `"${selectedPlan.title}" has been permanently deleted.`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  const handleTogglePublish = (planId) => {
    const plan = state.knowledgeGatherPlans.find(p => p.id === planId);
    if (plan) {
      const updatedPlan = { ...plan, isPublished: !plan.isPublished, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_KNOWLEDGE_GATHER_PLAN', payload: updatedPlan });
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'success',
          title: `Plan ${updatedPlan.isPublished ? 'Published' : 'Unpublished'}`,
          message: `"${plan.title}" has been ${updatedPlan.isPublished ? 'published and is now available for invitations' : 'unpublished and is no longer available'}.`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const handleInviteUser = (plan) => {
    setSelectedPlan(plan);
    setIsInviteModalOpen(true);
  };

  const handleViewEnrollment = (enrollmentId) => {
    navigate(`/knowledge-transfer/enrollments/${enrollmentId}`);
  };

  const clearPlansFilters = () => {
    setPlansSearchTerm('');
    setPlansStatusFilter('all');
    setPlansRoleFilter('all');
    setPlansCurrentPage(1);
  };

  const clearEnrollmentsFilters = () => {
    setEnrollmentsSearchTerm('');
    setEnrollmentsStatusFilter('all');
    setEnrollmentsPlanFilter('all');
    setEnrollmentsCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Gather Plans</h1>
          <p className="text-gray-600 mt-1">Create invitation-based knowledge gathering plans with course content, PDF review, and AI assessments</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'plans', label: 'Gather Plans', count: state.knowledgeGatherPlans.length },
            { id: 'enrollments', label: 'Enrollments', count: state.knowledgeGatherEnrollments.length },
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
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'plans' && (
        <>
          {/* Plans Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={plansSearchTerm}
                  onChange={(e) => setPlansSearchTerm(e.target.value)}
                  placeholder="Search plans..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={plansStatusFilter}
                onChange={(e) => setPlansStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>

              <select
                value={plansRoleFilter}
                onChange={(e) => setPlansRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={plansSortBy}
                onChange={(e) => setPlansSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updated">Sort by Updated</option>
                <option value="created">Sort by Created</option>
                <option value="title">Sort by Title</option>
                <option value="enrollments">Sort by Enrollments</option>
              </select>

              <button
                onClick={() => setPlansSortOrder(plansSortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {plansSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredPlans.length} of {state.knowledgeGatherPlans.length} plans
                </span>
                {(plansSearchTerm || plansStatusFilter !== 'all' || plansRoleFilter !== 'all') && (
                  <button
                    onClick={clearPlansFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {state.knowledgeGatherPlans.length === 0 ? 'No knowledge gather plans' : 'No plans match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {state.knowledgeGatherPlans.length === 0 
                  ? 'Create your first knowledge gather plan to start digital knowledge transfer'
                  : 'Try adjusting your search terms or filters'
                }
              </p>
              {state.knowledgeGatherPlans.length === 0 ? (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </button>
              ) : (
                <button
                  onClick={clearPlansFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {plan.title}
                          </h3>
                          <p className="text-sm text-blue-600 mt-1">
                            Target: {plan.targetRole}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            plan.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{plan.estimatedDuration}h</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>{plan.courses.length} courses</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          <span>{plan.assessments.length} assessments</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{plan.enrollmentCount} enrolled</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Completion Rate</span>
                          <span>{plan.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${plan.completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewPlan(plan.id)}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4 mr-1 inline" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <Edit3 className="w-4 h-4 mr-1 inline" />
                            Edit
                          </button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInviteUser(plan)}
                            disabled={!plan.isPublished}
                            className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserPlus className="w-4 h-4 mr-1 inline" />
                            Invite
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan)}
                            className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4 mr-1 inline" />
                            Delete
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleTogglePublish(plan.id)}
                          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            plan.isPublished
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          {plan.isPublished ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-1" />
                              Publish
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={plansCurrentPage}
                totalPages={plansTotalPages}
                onPageChange={setPlansCurrentPage}
                itemsPerPage={plansPerPage}
                totalItems={filteredPlans.length}
              />
            </>
          )}
        </>
      )}

      {activeTab === 'enrollments' && (
        <>
          {/* Enrollments Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={enrollmentsSearchTerm}
                  onChange={(e) => setEnrollmentsSearchTerm(e.target.value)}
                  placeholder="Search enrollments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={enrollmentsStatusFilter}
                onChange={(e) => setEnrollmentsStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="invited">Invited</option>
                <option value="enrolled">Enrolled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={enrollmentsPlanFilter}
                onChange={(e) => setEnrollmentsPlanFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                {state.knowledgeGatherPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.title}</option>
                ))}
              </select>

              <select
                value={enrollmentsSortBy}
                onChange={(e) => setEnrollmentsSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="enrolled">Sort by Enrolled</option>
                <option value="progress">Sort by Progress</option>
                <option value="score">Sort by Score</option>
              </select>

              <button
                onClick={() => setEnrollmentsSortOrder(enrollmentsSortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {enrollmentsSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredEnrollments.length} of {state.knowledgeGatherEnrollments.length} enrollments
                </span>
                {(enrollmentsSearchTerm || enrollmentsStatusFilter !== 'all' || enrollmentsPlanFilter !== 'all') && (
                  <button
                    onClick={clearEnrollmentsFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Enrollments Table */}
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {state.knowledgeGatherEnrollments.length === 0 ? 'No enrollments yet' : 'No enrollments match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {state.knowledgeGatherEnrollments.length === 0 
                  ? 'Invite users to knowledge gather plans to start seeing enrollments'
                  : 'Try adjusting your search terms or filters'
                }
              </p>
              {state.knowledgeGatherEnrollments.length > 0 && (
                <button
                  onClick={clearEnrollmentsFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phase
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedEnrollments.map((enrollment) => {
                        const plan = state.knowledgeGatherPlans.find(p => p.id === enrollment.planId);
                        return (
                          <tr key={enrollment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                  <Users className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">User {enrollment.userId}</div>
                                  <div className="text-sm text-gray-500">ID: {enrollment.userId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {plan?.title || 'Unknown Plan'}
                              </div>
                              <div className="text-sm text-gray-500">{plan?.targetRole}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                                {enrollment.status.replace('_', ' ').toUpperCase()}
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {enrollment.currentPhase.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {enrollment.enrolledAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewEnrollment(enrollment.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={enrollmentsCurrentPage}
                  totalPages={enrollmentsTotalPages}
                  onPageChange={setEnrollmentsCurrentPage}
                  itemsPerPage={enrollmentsPerPage}
                  totalItems={filteredEnrollments.length}
                  className="p-4 border-t border-gray-200"
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      <CreateKnowledgeGatherPlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedPlan && (
        <EditKnowledgeGatherPlanModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}

      {selectedPlan && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPlan(null);
          }}
          onConfirm={confirmDeletePlan}
          title="Delete Knowledge Gather Plan"
          message={`Are you sure you want to delete "${selectedPlan.title}"? This action cannot be undone and will remove all associated enrollments.`}
        />
      )}

      {selectedPlan && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}