import { useState } from 'react';
import { Bell, Search, User, HelpCircle, Settings, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, isAdmin } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGuidance } from '../../hooks/useGuidance';
import { HintTooltip } from '../Guidance/HintTooltip';
import { RoleBasedComponent } from '../Auth/ProtectedRoute';
import { PERMISSIONS, getRoleDisplayName, isAdmin as checkIsAdmin } from '../../utils/roleUtils';

export function Header() {
  const { state } = useApp();
  const { logout, user: authUser, userDetails } = useAuth();
  const navigate = useNavigate();
  const { showTooltips, toggleTooltips, resetGuidance } = useGuidance();
  const [showGuidanceMenu, setShowGuidanceMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadMessages = state.systemMessages.filter(msg => !msg.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, courses, or content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Role Badge - Shows user's role */}
            <RoleBasedComponent requiredPermission={PERMISSIONS.USERS}>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                {getRoleDisplayName(userDetails?.role)}
              </div>
            </RoleBasedComponent>
            
            {/* Guidance Menu */}
            <div className="relative">
              <HintTooltip hint="Access help and guidance options" position="bottom">
                <button 
                  onClick={() => setShowGuidanceMenu(!showGuidanceMenu)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </HintTooltip>
              
              {showGuidanceMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Guidance Options</h3>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        toggleTooltips();
                        setShowGuidanceMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      {showTooltips ? 'Hide' : 'Show'} Tooltips
                    </button>
                    <button
                      onClick={() => {
                        resetGuidance();
                        setShowGuidanceMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Reset Welcome Tour
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowGuidanceMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            <HintTooltip hint={unreadMessages > 0 ? `${unreadMessages} unread notifications` : "No new notifications"} position="bottom">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
            </HintTooltip>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userDetails?.firstName || authUser?.firstName || state.currentUser.firstName} {userDetails?.lastName || authUser?.lastName || state.currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userDetails?.email || authUser?.email || state.currentUser.email}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900">
                      {userDetails?.firstName || authUser?.firstName || state.currentUser.firstName} {userDetails?.lastName || authUser?.lastName || state.currentUser.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userDetails?.email || authUser?.email || state.currentUser.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getRoleDisplayName(userDetails?.role)}
                      {userDetails?.organization && (
                        <span> • {userDetails.organization.name}</span>
                      )}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}