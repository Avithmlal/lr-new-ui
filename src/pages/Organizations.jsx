import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Users, 
  Calendar, 
  DollarSign,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, hasPermission } from '../contexts/AppContext';
import { Pagination } from '../components/Common/Pagination';
import { getOrganizationsForUI } from '../api/organizationService';

export function Organizations() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [organizationsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Check permissions
  const canViewOrganizations = hasPermission(state.currentUser, 'organizations', 'read');
  const canCreateOrganization = hasPermission(state.currentUser, 'organizations', 'create');
  const canUpdateOrganization = hasPermission(state.currentUser, 'organizations', 'update');
  const canDeleteOrganization = hasPermission(state.currentUser, 'organizations', 'delete');

  useEffect(() => {
    // Redirect if no permission
    if (!canViewOrganizations) {
      navigate('/');
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to view organizations.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  }, [canViewOrganizations, navigate, dispatch]);

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      const params = {
        searchKey: searchTerm,
        status: statusFilter === 'all' ? '' : (statusFilter === 'active' ? 'ACTIVE' : 'INACTIVE'),
        limit: organizationsPerPage,
        pageNo: currentPage,
        sortField,
        sortOrder
      };

      const response = await getOrganizationsForUI(params);
      
      // Update context with organizations data
      dispatch({
        type: 'SET_ORGANIZATIONS',
        payload: response.data
      });
      
      setTotalCount(response.info?.totalCount || 0);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch organizations. Please try again.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizations when filters change
  useEffect(() => {
    if (canViewOrganizations) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        fetchOrganizations();
      }, searchTerm ? 500 : 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, statusFilter, currentPage, sortField, sortOrder, canViewOrganizations]);

  // Filter organizations client-side for plan filter (since backend doesn't have plan filter)
  const filteredOrganizations = state.organizations.filter(org => {
    const matchesPlan = planFilter === 'all' || org.plan.type === planFilter;
    return matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(totalCount / organizationsPerPage);
  const paginatedOrganizations = filteredOrganizations;

  const handleViewOrganization = (orgId) => {
    navigate(`/organizations/${orgId}`);
  };

  const handleToggleStatus = (orgId) => {
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

    const org = state.organizations.find(o => o.id === orgId);
    if (org) {
      dispatch({
        type: 'UPDATE_ORGANIZATION',
        payload: { ...org, isActive: !org.isActive, updatedAt: new Date() }
      });
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: org.isActive ? 'warning' : 'success',
          title: `Organization ${org.isActive ? 'Deactivated' : 'Activated'}`,
          message: `${org.name} has been ${org.isActive ? 'deactivated' : 'activated'}.`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!canViewOrganizations) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" />
            Organizations
          </h1>
          <p className="text-gray-600 mt-1">Manage customer organizations and their settings</p>
        </div>
        {canCreateOrganization && (
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </button>
        )}
      </div>

      {/* Admin Badge */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Admin Access</h3>
          <p className="text-sm text-red-800">
            You're viewing this page with administrative privileges. You can manage all organizations in the system.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search organizations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredOrganizations.length} of {totalCount} organizations
            </span>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading organizations...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrganizations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No organizations found
                  </td>
                </tr>
              ) : (
                paginatedOrganizations.map((organization) => (
                  <tr key={organization.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{organization.name}</div>
                        <div className="text-sm text-gray-500">{organization.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(organization.plan.type)}`}>
                      {organization.plan.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(organization.plan.price)}/{organization.plan.billingCycle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{organization.usage.totalUsers}</div>
                    <div className="text-xs text-gray-500">{organization.usage.activeUsers} active</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{organization.usage.totalProjects} projects</div>
                    <div className="text-xs text-gray-500">{organization.usage.storageUsedGB.toFixed(1)} GB storage</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {organization.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrganization(organization.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canUpdateOrganization && (
                        <button
                          onClick={() => handleToggleStatus(organization.id)}
                          className={`${organization.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {organization.isActive ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={organizationsPerPage}
          totalItems={totalCount}
          className="p-4 border-t border-gray-200"
        />
      </div>
    </div>
  );
}