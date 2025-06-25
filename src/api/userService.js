import axiosInstance from './axiosInstance';

/**
 * Fetch current user details and organization info
 * Returns user profile with role information
 */
export const getMyAccount = async () => {
  try {
    const response = await axiosInstance.get('/admin/my-account');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Failed to fetch user account:', error);
    return {
      success: false,
      error: error?.response?.data?.message || 'Failed to fetch user account',
      data: null
    };
  }
};

/**
 * Transform user data to include computed role information
 */
export const transformUserData = (userData) => {
  if (!userData) return null;

  const organizationInfo = userData.organizationInfo?.[0];
  
  return {
    ...userData,
    // Primary role determination (matches old UI logic)
    role: userData.role || organizationInfo?.organizationRole,
    // Organization context
    organization: organizationInfo ? {
      _id: organizationInfo._id,
      name: organizationInfo.name,
      logoUrl: organizationInfo.logoUrl,
      status: organizationInfo.status,
      organizationRole: organizationInfo.organizationRole
    } : null,
    // Role hierarchy for permission checks
    isSuper: userData.role === 'SUPER_ADMIN',
    isOrgAdmin: userData.role === 'SUPER_ADMIN' || organizationInfo?.organizationRole === 'ORGANIZATION_ADMIN',
    isOrgCreator: userData.role === 'SUPER_ADMIN' || 
                 organizationInfo?.organizationRole === 'ORGANIZATION_ADMIN' || 
                 organizationInfo?.organizationRole === 'ORGANIZATION_CREATOR'
  };
};

/**
 * Check if user has permission for a specific route/feature
 */
export const checkPermission = (userRole, requiredPermission) => {
  const rolePermissions = {
    SUPER_ADMIN: [
      "users",
      "organizations", 
      "journeys",
      "categories",
      "journeyDetails",
      "categoryDetails",
      "courses",
      "videos",
      "projects",
      "analytics"
    ],
    ORGANIZATION_ADMIN: [
      "users",
      "journeys", 
      "categories",
      "journeyDetails",
      "categoryDetails",
      "courses",
      "videos", 
      "projects"
    ],
    ORGANIZATION_CREATOR: [
      "journeys",
      "categories", 
      "journeyDetails",
      "categoryDetails",
      "courses",
      "videos",
      "projects"
    ],
    ORGANIZATION_USER: [
      "courses",
      "videos",
      "projects"
    ],
  };

  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(requiredPermission);
};

/**
 * Get user's permitted routes for navigation
 */
export const getPermittedRoutes = (userRole) => {
  const rolePermissions = {
    SUPER_ADMIN: [
      "dashboard",
      "users", 
      "organizations",
      "courses",
      "videos",
      "projects", 
      "chat",
      "avatars",
      "settings",
      "knowledge-transfer",
      "analytics"
    ],
    ORGANIZATION_ADMIN: [
      "dashboard",
      "users",
      "courses",
      "videos",
      "projects",
      "chat", 
      "avatars",
      "settings",
      "knowledge-transfer"
    ],
    ORGANIZATION_CREATOR: [
      "dashboard",
      "courses",
      "videos", 
      "projects",
      "chat",
      "avatars",
      "settings",
      "knowledge-transfer"
    ],
    ORGANIZATION_USER: [
      "dashboard",
      "courses",
      "videos",
      "projects",
      "chat",
      "settings"
    ],
  };

  return rolePermissions[userRole] || ["dashboard"];
};