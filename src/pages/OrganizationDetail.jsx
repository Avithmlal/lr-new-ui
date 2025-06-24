import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Settings, 
  BarChart3,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Activity,
  Shield
} from 'lucide-react';
import { useApp, hasPermission } from '../contexts/AppContext';

export function OrganizationDetail() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Check permissions
  const canViewOrganizations = hasPermission(state.currentUser, 'organizations', 'read');
  const canUpdateOrganization = hasPermission(state.currentUser, 'organizations', 'update');

  const organization = state.organizations.find(o => o.id === organizationId);
  const organizationUsers = state.users.filter(u => u.organizationId === organizationId);

  useEffect(() => {
    // Redirect if no permission or organization not found
    if (!canViewOrganizations) {
      navigate('/');
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to view organization details.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    } else if (!organization) {
      navigate('/organizations');
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Organization Not Found',
          message: 'The requested organization could not be found.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  }, [canViewOrganizations, organization, navigate, dispatch]);

  const handleToggleStatus = () => {
    if (!canUpdateOrganization) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Permission Denied',
          message: 'You do not have permission to update organization status.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }

    dispatch({
      type: 'UPDATE_ORGANIZATION',
      payload: { ...organization, isActive: !organization.isActive, updatedAt: new Date() }
    });
    
    dispatch({
      type: 'ADD_SYSTEM_MESSAGE',
      payload: {
        id: Date.now().toString(),
        type: organization.isActive ? 'warning' : 'success',
        title: `Organization ${organization.isActive ? 'Deactivated' : 'Activated'}`,
        message: `${organization.name} has been ${organization.isActive ? 'deactivated' : 'activated'}.`,
        timestamp: new Date(),
        isRead: false,
      }
    });
  };

  const getPlanBadgeColor = (planType) => {
    switch (planType) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{organization.usage.totalUsers}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{organization.usage.activeUsers} active</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{organization.usage.totalProjects}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900">{organization.usage.storageUsedGB.toFixed(1)} GB</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {organization.limits.maxStorageGB > 0 
                    ? `${((organization.usage.storageUsedGB / organization.limits.maxStorageGB) * 100).toFixed(1)}% of limit`
                    : 'Unlimited'
                  }
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${organization.plan.price}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{organization.plan.name} plan</p>
              </div>
            </div>

            {/* Organization Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{organization.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Domain</label>
                    <p className="text-gray-900">{organization.domain}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Plan</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(organization.plan.type)}`}>
                      {organization.plan.name}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center">
                      {organization.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${organization.isActive ? 'text-green-800' : 'text-red-800'}`}>
                        {organization.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-gray-900">{organization.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-900">{organization.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Limits */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Limits & Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Users</span>
                    <span className="text-sm text-gray-600">
                      {organization.usage.totalUsers} / {organization.limits.maxUsers > 0 ? organization.limits.maxUsers : '∞'}
                    </span>
                  </div>
                  {organization.limits.maxUsers > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((organization.usage.totalUsers / organization.limits.maxUsers) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Storage</span>
                    <span className="text-sm text-gray-600">
                      {organization.usage.storageUsedGB.toFixed(1)} GB / {organization.limits.maxStorageGB > 0 ? `${organization.limits.maxStorageGB} GB` : '∞'}
                    </span>
                  </div>
                  {organization.limits.maxStorageGB > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${Math.min((organization.usage.storageUsedGB / organization.limits.maxStorageGB) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Projects</span>
                    <span className="text-sm text-gray-600">
                      {organization.usage.totalProjects} / {organization.limits.maxProjects > 0 ? organization.limits.maxProjects : '∞'}
                    </span>
                  </div>
                  {organization.limits.maxProjects > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min((organization.usage.totalProjects / organization.limits.maxProjects) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Organization Users</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Add User
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizationUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {user.role.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                          )}
                          <span className={`text-sm ${user.isActive ? 'text-green-800' : 'text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  if (!organization) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/organizations')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-gray-600">{organization.domain}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {canUpdateOrganization && (
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                organization.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {organization.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Admin Access</h3>
          <p className="text-sm text-red-800">
            You're viewing this page with administrative privileges. You can manage all aspects of this organization.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users', count: organizationUsers.length },
            { id: 'usage', label: 'Usage' },
            { id: 'settings', label: 'Settings' },
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