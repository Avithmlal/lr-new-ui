import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Users as UsersIcon, 
  Calendar, 
  Shield,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Crown,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, hasPermission } from '../contexts/AppContext';
import { Pagination } from '../components/Common/Pagination';

export function Users() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [organizationFilter, setOrganizationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Check permissions
  const canViewUsers = hasPermission(state.currentUser, 'users', 'read');
  const canCreateUser = hasPermission(state.currentUser, 'users', 'create');
  const canUpdateUser = hasPermission(state.currentUser, 'users', 'update');
  const canDeleteUser = hasPermission(state.currentUser, 'users', 'delete');

  useEffect(() => {
    // Redirect if no permission
    if (!canViewUsers) {
      navigate('/');
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to view users.',
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  }, [canViewUsers, navigate, dispatch]);

  // Filter users
  const filteredUsers = state.users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    const matchesRole = roleFilter === 'all' || user.role.type === roleFilter;
    const matchesOrganization = organizationFilter === 'all' || user.organizationId === organizationFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesOrganization;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleToggleStatus = (userId) => {
    if (!canUpdateUser) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Permission Denied',
          message: 'You do not have permission to update user status.',
          timestamp: new Date(),
          isRead: false,
        }
      });
      return;
    }

    const user = state.users.find(u => u.id === userId);
    if (user) {
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...user, isActive: !user.isActive, updatedAt: new Date() }
      });
      
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: Date.now().toString(),
          type: user.isActive ? 'warning' : 'success',
          title: `User ${user.isActive ? 'Deactivated' : 'Activated'}`,
          message: `${user.firstName} ${user.lastName} has been ${user.isActive ? 'deactivated' : 'activated'}.`,
          timestamp: new Date(),
          isRead: false,
        }
      });
    }
  };

  const getRoleBadgeColor = (roleType) => {
    switch (roleType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'org_admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case 'admin': return Crown;
      case 'org_admin': return Shield;
      case 'user': return User;
      default: return User;
    }
  };

  const getOrganizationName = (organizationId) => {
    const org = state.organizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown';
  };

  const formatLastLogin = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!canViewUsers) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UsersIcon className="w-6 h-6 mr-2 text-blue-600" />
            Users
          </h1>
          <p className="text-gray-600 mt-1">Manage user accounts across all organizations</p>
        </div>
        {canCreateUser && (
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      {/* Admin Badge */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Admin Access</h3>
          <p className="text-sm text-red-800">
            You're viewing this page with administrative privileges. You can manage all users in the system.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="org_admin">Org Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Organizations</option>
            {state.organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredUsers.length} of {state.users.length} users
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
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
              {paginatedUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role.type);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RoleIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role.type)}`}>
                          {user.role.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getOrganizationName(user.organizationId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.usage.projectsCreated} projects</div>
                      <div className="text-xs text-gray-500">{user.usage.coursesGenerated} courses</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastLogin(user.lastLoginAt)}
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canUpdateUser && (
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.isActive ? (
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
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={usersPerPage}
          totalItems={filteredUsers.length}
          className="p-4 border-t border-gray-200"
        />
      </div>
    </div>
  );
}