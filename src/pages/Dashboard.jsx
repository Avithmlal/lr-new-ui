import React, { useEffect } from 'react';
import { FolderOpen, GraduationCap, MessageSquare, Zap, Video, Building2, Users, BarChart3, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { WelcomeBanner } from '../components/Guidance/WelcomeBanner';
import { HintTooltip } from '../components/Guidance/HintTooltip';
import { useApp, isAdmin, isOrgAdmin } from '../contexts/AppContext';
import { useGuidance } from '../hooks/useGuidance';
import { HINTS } from '../constants/hints';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { showWelcomeBanner, showTooltips, dismissWelcomeBanner, markStepCompleted } = useGuidance();

  useEffect(() => {
    // Initialize with sample data
    if (state.projects.length === 0) {
      const sampleProjects = [
        {
          id: '1',
          title: 'React Mastery Course',
          description: 'Advanced React patterns and best practices for modern web development.',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          mediaAssets: [
            {
              id: '1',
              projectId: '1',
              type: 'document',
              title: 'React Hooks Guide',
              content: 'Comprehensive guide to React hooks...',
              metadata: { size: 1024, tags: ['react', 'hooks'] },
              createdAt: new Date(),
            },
          ],
          courses: [],
          isShared: true,
          collaborators: ['jane@example.com'],
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals',
          description: 'Core JavaScript concepts for beginners to intermediate developers.',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          mediaAssets: [],
          courses: [],
          isShared: false,
          collaborators: [],
        },
      ];

      dispatch({ type: 'SET_PROJECTS', payload: sampleProjects });
    }

    // Initialize admin data if user is admin
    if (isAdmin(state.currentUser) && !state.adminStats) {
      // Mock admin stats
      const mockAdminStats = {
        totalOrganizations: 156,
        totalUsers: 2847,
        totalProjects: 8934,
        totalCourses: 12456,
        totalStorageGB: 2847.5,
        activeOrganizations: 142,
        activeUsers: 1923,
        revenueThisMonth: 89750,
        growthMetrics: {
          userGrowth: 12.5,
          organizationGrowth: 8.3,
          revenueGrowth: 15.7,
        },
        topOrganizations: [
          {
            id: '1',
            name: 'TechCorp Inc.',
            domain: 'techcorp.com',
            plan: {
              id: 'enterprise',
              name: 'Enterprise',
              type: 'enterprise',
              price: 299,
              billingCycle: 'monthly',
              features: ['Unlimited users', 'Advanced analytics', 'Priority support'],
              limits: {
                maxUsers: -1,
                maxProjects: -1,
                maxStorageGB: 1000,
                maxBillySessionsPerMonth: -1,
                maxCoursesPerMonth: -1,
              }
            },
            isActive: true,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-20'),
            settings: {
              allowUserRegistration: true,
              requireEmailVerification: true,
              defaultUserRole: 'user',
              billyEnabled: true,
              courseGenerationEnabled: true,
              avatarEnabled: true,
              customBranding: {
                primaryColor: '#3B82F6',
              }
            },
            usage: {
              totalUsers: 245,
              activeUsers: 189,
              totalProjects: 1234,
              totalCourses: 2456,
              totalMediaAssets: 8934,
              storageUsedGB: 456.7,
              billySessionsCount: 3456,
              lastActivityAt: new Date(),
              monthlyStats: []
            },
            limits: {
              maxUsers: -1,
              maxProjects: -1,
              maxStorageGB: 1000,
              maxBillySessionsPerMonth: -1,
              maxCoursesPerMonth: -1,
            }
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'organization_created',
            description: 'New organization "EduTech Solutions" created',
            organizationName: 'EduTech Solutions',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: '2',
            type: 'user_created',
            description: 'New user registered: sarah@techcorp.com',
            organizationName: 'TechCorp Inc.',
            userEmail: 'sarah@techcorp.com',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
          {
            id: '3',
            type: 'subscription_changed',
            description: 'Organization upgraded to Enterprise plan',
            organizationName: 'Learning Labs',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          },
          {
            id: '4',
            type: 'course_generated',
            description: 'High course generation activity detected',
            organizationName: 'TechCorp Inc.',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          },
        ]
      };

      dispatch({ type: 'SET_ADMIN_STATS', payload: mockAdminStats });

      // Mock organizations
      const mockOrganizations = [
        {
          id: '1',
          name: 'TechCorp Inc.',
          domain: 'techcorp.com',
          plan: mockAdminStats.topOrganizations[0].plan,
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          settings: mockAdminStats.topOrganizations[0].settings,
          usage: mockAdminStats.topOrganizations[0].usage,
          limits: mockAdminStats.topOrganizations[0].limits,
        },
        {
          id: '2',
          name: 'EduTech Solutions',
          domain: 'edutech.com',
          plan: {
            id: 'professional',
            name: 'Professional',
            type: 'professional',
            price: 99,
            billingCycle: 'monthly',
            features: ['Up to 100 users', 'Advanced features', 'Email support'],
            limits: {
              maxUsers: 100,
              maxProjects: 500,
              maxStorageGB: 100,
              maxBillySessionsPerMonth: 1000,
              maxCoursesPerMonth: 100,
            }
          },
          isActive: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          settings: {
            allowUserRegistration: false,
            requireEmailVerification: true,
            defaultUserRole: 'user',
            billyEnabled: true,
            courseGenerationEnabled: true,
            avatarEnabled: false,
            customBranding: {}
          },
          usage: {
            totalUsers: 67,
            activeUsers: 45,
            totalProjects: 234,
            totalCourses: 456,
            totalMediaAssets: 1234,
            storageUsedGB: 67.8,
            billySessionsCount: 789,
            lastActivityAt: new Date(),
            monthlyStats: []
          },
          limits: {
            maxUsers: 100,
            maxProjects: 500,
            maxStorageGB: 100,
            maxBillySessionsPerMonth: 1000,
            maxCoursesPerMonth: 100,
          }
        }
      ];

      dispatch({ type: 'SET_ORGANIZATIONS', payload: mockOrganizations });

      // Mock users
      const mockUsers = [
        {
          id: '1',
          email: 'john@techcorp.com',
          firstName: 'John',
          lastName: 'Doe',
          role: {
            type: 'org_admin',
            permissions: [
              { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
              { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
            ]
          },
          organizationId: '1',
          isActive: true,
          lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'America/New_York',
            notifications: {
              email: true,
              push: true,
              projectUpdates: true,
              courseGeneration: true,
            }
          },
          usage: {
            projectsCreated: 12,
            coursesGenerated: 34,
            mediaAssetsUploaded: 156,
            billySessionsCount: 89,
            storageUsedMB: 2340,
            lastActivityAt: new Date(),
          }
        }
      ];

      dispatch({ type: 'SET_USERS', payload: mockUsers });
    }
  }, [state.projects.length, state.currentUser, state.adminStats, dispatch]);

  const totalProjects = state.projects.length;
  const totalCourses = state.projects.reduce((acc, project) => acc + project.courses.length, 0);
  const totalAssets = state.projects.reduce((acc, project) => acc + project.mediaAssets.length, 0);
  const totalVideos = state.videos?.length || 0;

  const handleQuickAction = (action) => {
    markStepCompleted(`quick_action_${action}`);
    switch (action) {
      case 'create_project':
        navigate('/projects');
        break;
      case 'billy_chat':
        navigate('/chat');
        break;
      case 'generate_course':
        navigate('/courses');
        break;
      case 'create_video':
        navigate('/videos');
        break;
    }
  };

  const handleStatsCardClick = (section) => {
    navigate(`/${section}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {showWelcomeBanner && (
        <WelcomeBanner onDismiss={dismissWelcomeBanner} />
      )}

      {/* Regular User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HintTooltip hint="Your active projects where you store documents, conversations, and generate content" position="bottom">
          <div>
            <StatsCard
              title="Active Projects"
              value={totalProjects}
              change="+2 this week"
              changeType="positive"
              icon={FolderOpen}
              color="bg-blue-500"
              onClick={() => handleStatsCardClick('projects')}
            />
          </div>
        </HintTooltip>
        
        <HintTooltip hint="Structured courses automatically generated from your project content" position="bottom">
          <div>
            <StatsCard
              title="Courses Created"
              value={totalCourses}
              change="+1 this week"
              changeType="positive"
              icon={GraduationCap}
              color="bg-green-500"
              onClick={() => handleStatsCardClick('courses')}
            />
          </div>
        </HintTooltip>

        <HintTooltip hint="AI-generated videos from your project content using avatars" position="bottom">
          <div>
            <StatsCard
              title="Videos Generated"
              value={totalVideos}
              change="+3 this week"
              changeType="positive"
              icon={Video}
              color="bg-purple-500"
              onClick={() => handleStatsCardClick('videos')}
            />
          </div>
        </HintTooltip>
        
        <HintTooltip hint="Documents, audio, video, and chat logs stored in your projects" position="bottom">
          <div>
            <StatsCard
              title="Media Assets"
              value={totalAssets}
              change="+5 this week"
              changeType="positive"
              icon={Zap}
              color="bg-orange-500"
            />
          </div>
        </HintTooltip>
      </div>

      {/* Admin Stats - Only shown to admins */}
      {isAdmin(state.currentUser) && state.adminStats && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Admin Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Organizations"
              value={formatNumber(state.adminStats.totalOrganizations)}
              change={`+${state.adminStats.growthMetrics.organizationGrowth}%`}
              changeType="positive"
              icon={Building2}
              color="bg-blue-500"
              onClick={() => handleStatsCardClick('organizations')}
            />
            <StatsCard
              title="Total Users"
              value={formatNumber(state.adminStats.totalUsers)}
              change={`+${state.adminStats.growthMetrics.userGrowth}%`}
              changeType="positive"
              icon={Users}
              color="bg-green-500"
              onClick={() => handleStatsCardClick('users')}
            />
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(state.adminStats.revenueThisMonth)}
              change={`+${state.adminStats.growthMetrics.revenueGrowth}%`}
              changeType="positive"
              icon={DollarSign}
              color="bg-emerald-500"
            />
            <StatsCard
              title="Analytics"
              value="View Reports"
              icon={BarChart3}
              color="bg-purple-500"
              onClick={() => handleStatsCardClick('analytics')}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600 mt-1">Get started with these common tasks</p>
          </div>
          <div className="p-4 space-y-3">
            <HintTooltip hint={HINTS.CREATE_PROJECT} position="left">
              <button 
                onClick={() => handleQuickAction('create_project')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create New Project</p>
                    <p className="text-sm text-gray-600">Start a new knowledge capture project</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
            
            <HintTooltip hint={HINTS.BILLY_CHAT} position="left">
              <button 
                onClick={() => handleQuickAction('billy_chat')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Chat with Billy</p>
                    <p className="text-sm text-gray-600">Get help with content creation</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
            
            <HintTooltip hint={HINTS.GENERATE_COURSE} position="left">
              <button 
                onClick={() => handleQuickAction('generate_course')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Generate Course</p>
                    <p className="text-sm text-gray-600">Turn your content into a structured course</p>
                  </div>
                </div>
              </button>
            </HintTooltip>

            <HintTooltip hint="Create AI-generated videos from your project content" position="left">
              <button 
                onClick={() => handleQuickAction('create_video')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Video className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create Video</p>
                    <p className="text-sm text-gray-600">Generate AI videos with avatars</p>
                  </div>
                </div>
              </button>
            </HintTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}