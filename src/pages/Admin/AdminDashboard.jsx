import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Server,
  CheckCircle,
  FolderOpen,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { Settings } from '../Settings';

export function AdminDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize admin mode and mock data
    dispatch({ type: 'SET_IS_ADMIN', payload: true });
    
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
    dispatch({ type: 'SET_CURRENT_USER', payload: {
      ...mockUsers[0],
      role: { type: 'admin', permissions: [] }
    }});
  }, [dispatch]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'organization_created': return Building2;
      case 'user_created': return Users;
      case 'project_created': return FolderOpen;
      case 'course_generated': return GraduationCap;
      case 'subscription_changed': return DollarSign;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'organization_created': return 'bg-blue-500';
      case 'user_created': return 'bg-green-500';
      case 'project_created': return 'bg-purple-500';
      case 'course_generated': return 'bg-orange-500';
      case 'subscription_changed': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
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

  if (!state.adminStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Organizations"
          value={formatNumber(state.adminStats.totalOrganizations)}
          change={`+${state.adminStats.growthMetrics.organizationGrowth}%`}
          changeType="positive"
          icon={Building2}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Users"
          value={formatNumber(state.adminStats.totalUsers)}
          change={`+${state.adminStats.growthMetrics.userGrowth}%`}
          changeType="positive"
          icon={Users}
          color="bg-green-500"
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
          title="Storage Used"
          value={`${state.adminStats.totalStorageGB.toFixed(1)} GB`}
          change="+8.2% this month"
          changeType="neutral"
          icon={Server}
          color="bg-purple-500"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(state.adminStats.activeOrganizations)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((state.adminStats.activeOrganizations / state.adminStats.totalOrganizations) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(state.adminStats.activeUsers)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((state.adminStats.activeUsers / state.adminStats.totalUsers) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(state.adminStats.totalProjects)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(state.adminStats.totalCourses)}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Organizations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Organizations</h3>
              <button 
                onClick={() => navigate('/admin/organizations')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {state.adminStats.topOrganizations.map((org) => (
                <div 
                  key={org.id}
                  onClick={() => navigate(`/admin/organizations/${org.id}`)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-600">{org.usage.totalUsers} users • {org.plan.name} plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(org.plan.price)}/mo</p>
                    <p className="text-xs text-gray-500">{org.usage.storageUsedGB.toFixed(1)} GB used</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Analytics
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {state.adminStats.recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      {activity.organizationName && (
                        <p className="text-xs text-gray-600 mt-1">Organization: {activity.organizationName}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/organizations')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Organizations</p>
              <p className="text-sm text-gray-600">View and edit organizations</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">User accounts and permissions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/analytics')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Usage and performance metrics</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">System Settings</p>
              <p className="text-sm text-gray-600">Configure system preferences</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}