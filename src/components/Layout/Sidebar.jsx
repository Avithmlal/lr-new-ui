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
  Brain
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const userNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
  { name: 'Billy Chat', href: '/chat', icon: MessageSquare },
  { name: 'Knowledge Plans', href: '/knowledge-transfer', icon: Brain },
  { name: 'Avatars', href: '/avatars', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  { name: 'Organizations', href: '/admin/organizations', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { state } = useApp();
  
  const navigation = state.isAdmin ? adminNavigation : userNavigation;
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {state.isAdmin && isAdminRoute ? 'Admin Panel' : 'Leaproad'}
          </h1>
        </div>
        {state.isAdmin && (
          <div className="mt-2 text-xs text-gray-500">
            {isAdminRoute ? 'System Administration' : 'User Interface'}
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
            </Link>
          );
        })}
      </nav>

      {/* Admin Toggle */}
      {state.isAdmin && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Admin Mode</span>
            <Link
              to={isAdminRoute ? '/' : '/admin'}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isAdminRoute ? 'User View' : 'Admin View'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}