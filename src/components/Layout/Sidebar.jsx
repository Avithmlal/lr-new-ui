// React import not needed with automatic JSX runtime
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
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS, filterMenuByRole, getRoleDisplayName } from '../../utils/roleUtils';

export function Sidebar() {
  const location = useLocation();
  const { state } = useApp();
  const { userDetails } = useAuth();
  
  // All navigation items with permission mappings
  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard' },
    { name: 'Projects', href: '/projects', icon: FolderOpen, permission: PERMISSIONS.PROJECTS },
    { name: 'Courses', href: '/courses', icon: GraduationCap, permission: PERMISSIONS.COURSES },
    { name: 'Videos', href: '/videos', icon: Video, permission: PERMISSIONS.VIDEOS },
    { name: 'Billy Chat', href: '/chat', icon: MessageSquare, permission: PERMISSIONS.CHAT },
    { name: 'Knowledge Plans', href: '/knowledge-transfer', icon: Brain, permission: PERMISSIONS.KNOWLEDGE_TRANSFER },
    { name: 'Avatars', href: '/avatars', icon: Users, permission: PERMISSIONS.AVATARS },
    { name: 'Settings', href: '/settings', icon: Settings, permission: PERMISSIONS.SETTINGS },
    // Admin navigation
    { name: 'Organizations', href: '/organizations', icon: Building2, permission: PERMISSIONS.ORGANIZATIONS, adminOnly: true },
    { name: 'Users', href: '/users', icon: UserCog, permission: PERMISSIONS.USERS, adminOnly: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: PERMISSIONS.ANALYTICS, adminOnly: true },
  ];
  
  // Filter navigation based on user role
  const userRole = userDetails?.role;
  const navigation = filterMenuByRole(allNavigation, userRole);

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Leaproad</h1>
        </div>
        {userDetails?.role && (
          <div className="mt-2 flex items-center">
            <Shield className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-xs text-gray-500">{getRoleDisplayName(userDetails.role)}</span>
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
            <p className="text-sm font-medium text-gray-900">
              {userDetails?.firstName || state.currentUser.firstName} {userDetails?.lastName || state.currentUser.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {userDetails?.email || state.currentUser.email}
            </p>
            {userDetails?.organization && (
              <p className="text-xs text-gray-400">
                {userDetails.organization.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}