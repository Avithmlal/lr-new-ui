import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  GraduationCap, 
  MessageSquare, 
  Users, 
  Settings,
  Zap,
  Shield,
  Building2,
  BarChart3,
  UserCog,
  Brain,
  Video
} from 'lucide-react';
import { useApp, isAdmin, isOrgAdmin } from '../../contexts/AppContext';

export function Sidebar() {
  const location = useLocation();
  const { state } = useApp();
  
  // Base navigation items for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Courses', href: '/courses', icon: GraduationCap },
    { name: 'Videos', href: '/videos', icon: Video },
    { name: 'Billy Chat', href: '/chat', icon: MessageSquare },
    { name: 'Knowledge Plans', href: '/knowledge-transfer', icon: Brain },
    { name: 'Avatars', href: '/avatars', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  // Admin-only navigation items
  const adminNavigation = [
    { name: 'Organizations', href: '/organizations', icon: Building2, adminOnly: true },
    { name: 'Users', href: '/users', icon: UserCog, adminOnly: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, adminOnly: true },
  ];
  
  // Combine navigation based on user role
  const navigation = [
    ...baseNavigation,
    ...(isAdmin(state.currentUser) ? adminNavigation : [])
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Leaproad</h1>
        </div>
        {isAdmin(state.currentUser) && (
          <div className="mt-2 flex items-center">
            <Shield className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-xs text-gray-500">Admin Access</span>
          </div>
        )}
        {isOrgAdmin(state.currentUser) && (
          <div className="mt-2 flex items-center">
            <Building2 className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-xs text-gray-500">Organization Admin</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              />
              {item.name}
              {item.adminOnly && (
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{state.currentUser.firstName} {state.currentUser.lastName}</p>
            <p className="text-xs text-gray-500">{state.currentUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}