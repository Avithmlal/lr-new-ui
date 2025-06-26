import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessRoute, getRedirectRoute } from '../../utils/roleUtils';

export function ProtectedRoute({ children, requiredPermission }) {
  const { isAuthenticated, loading, userDetails } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredPermission && userDetails) {
    const userRole = userDetails.role;
    const currentPath = location.pathname;
    
    if (!canAccessRoute(userRole, currentPath) && !canAccessRoute(userRole, requiredPermission)) {
      // Get appropriate redirect route based on role
      const redirectTo = getRedirectRoute(userRole, currentPath);
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}

// Component for role-based conditional rendering
export function RoleBasedComponent({ children, requiredPermission, userRole, fallback = null }) {
  const { userDetails } = useAuth();
  
  // Use provided userRole or get from context
  const role = userRole || userDetails?.role;
  
  if (!role) {
    return fallback;
  }
  
  // Check if user has required permission
  if (requiredPermission && !canAccessRoute(role, requiredPermission)) {
    return fallback;
  }
  
  return children;
}

// Higher-order component for role-based access
export function withRoleCheck(Component, requiredPermission) {
  return function RoleCheckedComponent(props) {
    return (
      <RoleBasedComponent requiredPermission={requiredPermission}>
        <Component {...props} />
      </RoleBasedComponent>
    );
  };
}

// Component for routes that should only be accessible to unauthenticated users
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}