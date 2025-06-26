/**
 * Role-based access control utilities
 * Consistent with leaproad-admin-ui implementation
 */

// Role hierarchy constants
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN', 
  ORGANIZATION_CREATOR: 'ORGANIZATION_CREATOR',
  ORGANIZATION_USER: 'ORGANIZATION_USER'
};

// Permission definitions matching old UI
export const PERMISSIONS = {
  // Admin permissions
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  ANALYTICS: 'analytics',
  
  // Content permissions
  COURSES: 'courses',
  VIDEOS: 'videos',
  JOURNEYS: 'journeys',
  CATEGORIES: 'categories',
  PROJECTS: 'projects',
  
  // Detail permissions
  JOURNEY_DETAILS: 'journeyDetails',
  CATEGORY_DETAILS: 'categoryDetails',
  
  // Other permissions
  CHAT: 'chat',
  AVATARS: 'avatars',
  SETTINGS: 'settings',
  KNOWLEDGE_TRANSFER: 'knowledge-transfer',
  VIDEO_COMPOSITION: 'video composition',
  VIDEO_SESSIONS: 'video sessions'
};

// Role permission mapping (matches old UI exactly)
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.USERS,
    PERMISSIONS.ORGANIZATIONS,
    PERMISSIONS.JOURNEYS,
    PERMISSIONS.CATEGORIES,
    PERMISSIONS.JOURNEY_DETAILS,
    PERMISSIONS.CATEGORY_DETAILS,
    PERMISSIONS.COURSES,
    PERMISSIONS.VIDEOS,
    PERMISSIONS.PROJECTS,
    PERMISSIONS.ANALYTICS,
    PERMISSIONS.CHAT,
    PERMISSIONS.AVATARS,
    PERMISSIONS.SETTINGS,
    PERMISSIONS.KNOWLEDGE_TRANSFER,
    PERMISSIONS.VIDEO_COMPOSITION,
    PERMISSIONS.VIDEO_SESSIONS
  ],
  [ROLES.ORGANIZATION_ADMIN]: [
    PERMISSIONS.USERS,
    PERMISSIONS.JOURNEYS,
    PERMISSIONS.CATEGORIES,
    PERMISSIONS.JOURNEY_DETAILS,
    PERMISSIONS.CATEGORY_DETAILS,
    PERMISSIONS.COURSES,
    PERMISSIONS.VIDEOS,
    PERMISSIONS.PROJECTS,
    PERMISSIONS.CHAT,
    PERMISSIONS.AVATARS,
    PERMISSIONS.SETTINGS,
    PERMISSIONS.KNOWLEDGE_TRANSFER,
    PERMISSIONS.VIDEO_COMPOSITION,
    PERMISSIONS.VIDEO_SESSIONS
  ],
  [ROLES.ORGANIZATION_CREATOR]: [
    PERMISSIONS.JOURNEYS,
    PERMISSIONS.CATEGORIES,
    PERMISSIONS.JOURNEY_DETAILS,
    PERMISSIONS.CATEGORY_DETAILS,
    PERMISSIONS.COURSES,
    PERMISSIONS.VIDEOS,
    PERMISSIONS.PROJECTS,
    PERMISSIONS.CHAT,
    PERMISSIONS.AVATARS,
    PERMISSIONS.SETTINGS,
    PERMISSIONS.KNOWLEDGE_TRANSFER,
    PERMISSIONS.VIDEO_COMPOSITION,
    PERMISSIONS.VIDEO_SESSIONS
  ],
  [ROLES.ORGANIZATION_USER]: [
    PERMISSIONS.COURSES,
    PERMISSIONS.VIDEOS,
    PERMISSIONS.PROJECTS,
    PERMISSIONS.CHAT,
    PERMISSIONS.SETTINGS
  ]
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if user has permission (matches old UI pattern)
 */
export const checkRolePermission = (role, permission) => {
  return hasPermission(role, permission);
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if role is admin level (SUPER_ADMIN or ORGANIZATION_ADMIN)
 */
export const isAdmin = (role) => {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ORGANIZATION_ADMIN;
};

/**
 * Check if role is super admin
 */
export const isSuper = (role) => {
  return role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user can manage other users
 */
export const canManageUsers = (role) => {
  return hasPermission(role, PERMISSIONS.USERS);
};

/**
 * Check if user can manage organizations
 */
export const canManageOrganizations = (role) => {
  return hasPermission(role, PERMISSIONS.ORGANIZATIONS);
};

/**
 * Check if user can create content
 */
export const canCreateContent = (role) => {
  return hasPermission(role, PERMISSIONS.COURSES) || 
         hasPermission(role, PERMISSIONS.VIDEOS) || 
         hasPermission(role, PERMISSIONS.PROJECTS);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ORGANIZATION_ADMIN]: 'Organization Admin',
    [ROLES.ORGANIZATION_CREATOR]: 'Creator',
    [ROLES.ORGANIZATION_USER]: 'User'
  };
  return roleNames[role] || role;
};

/**
 * Route permission mapping for navigation
 */
export const ROUTE_PERMISSIONS = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/users': PERMISSIONS.USERS,
  '/organizations': PERMISSIONS.ORGANIZATIONS,
  '/courses': PERMISSIONS.COURSES,
  '/videos': PERMISSIONS.VIDEOS,
  '/projects': PERMISSIONS.PROJECTS,
  '/chat': PERMISSIONS.CHAT,
  '/avatars': PERMISSIONS.AVATARS,
  '/settings': PERMISSIONS.SETTINGS,
  '/knowledge-transfer': PERMISSIONS.KNOWLEDGE_TRANSFER,
  '/analytics': PERMISSIONS.ANALYTICS
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (role, routePath) => {
  // Dashboard is accessible to all authenticated users
  if (routePath === '/' || routePath === '/dashboard') {
    return true;
  }
  
  const permission = ROUTE_PERMISSIONS[routePath];
  if (!permission) return true; // Allow access to routes without specific permissions
  
  return hasPermission(role, permission);
};

/**
 * Filter menu items based on user role
 */
export const filterMenuByRole = (menuItems, role) => {
  return menuItems.filter(item => {
    const permission = item.permission || item.label?.toLowerCase();
    return hasPermission(role, permission);
  });
};

/**
 * Get redirect route for unauthorized access (matches old UI logic)
 */
export const getRedirectRoute = (role, requestedRoute) => {
  // If user can't access journeys, redirect to videos
  if (requestedRoute === '/journeys' && !hasPermission(role, PERMISSIONS.JOURNEYS)) {
    return '/videos';
  }
  
  // Default redirect to dashboard
  return '/';
};