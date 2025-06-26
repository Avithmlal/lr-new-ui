import axiosInstance from './axiosInstance';

// Get organizations with filters and search
export const getOrganizations = async (
  searchKey = '',
  status = '',
  limit = 10,
  pageNo = 1,
  sortField = 'createdAt',
  sortOrder = 'DESC'
) => {
  try {
    let query = '?';
    const params = [];

    if (searchKey?.length > 0) {
      params.push(`searchKey=${encodeURIComponent(searchKey)}`);
    }
    if (status) {
      params.push(`status=${status}`);
    }
    if (limit) {
      params.push(`limit=${limit}`);
    }
    if (pageNo > 0) {
      params.push(`pageNo=${pageNo}`);
    }
    if (sortField) {
      params.push(`sortField=${sortField}`);
    }
    if (sortOrder) {
      params.push(`sortOrder=${sortOrder}`);
    }

    query += params.join('&');

    const response = await axiosInstance.get(`/admin/organizations${query}`);
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error('Organizations fetch failed');
    }
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

// Get organization details by ID
export const getOrganizationDetails = async (organizationId) => {
  try {
    const response = await axiosInstance.get(`/admin/organizations/${organizationId}`);
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error('Organization details fetch failed');
    }
  } catch (error) {
    console.error('Error fetching organization details:', error);
    throw error;
  }
};

// Create new organization
export const createOrganization = async (organizationData) => {
  try {
    const response = await axiosInstance.post('/admin/organizations', organizationData);
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error('Organization creation failed: No data received.');
    }
  } catch (error) {
    console.error('Error creating organization:', error.response);
    throw new Error(
      error.response?.data?.message || 'Failed to create organization'
    );
  }
};

// Update organization
export const updateOrganization = async (organizationId, updateData) => {
  try {
    const response = await axiosInstance.patch(`/admin/organizations/${organizationId}`, updateData);
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error('Organization update failed');
    }
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

// Delete organization (if needed)
export const deleteOrganization = async (organizationId) => {
  try {
    const response = await axiosInstance.delete(`/admin/organizations/${organizationId}`);
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error('Organization deletion failed');
    }
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

// Transform API data to match new UI format
export const transformOrganizationData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map(org => ({
    id: org._id,
    name: org.name,
    domain: org.adminDomain || org.email?.split('@')[1] || 'N/A',
    plan: {
      type: 'professional', // Default plan type since backend doesn't have this
      name: 'Professional',
      price: 99,
      billingCycle: 'month'
    },
    usage: {
      totalUsers: 0, // This would come from user count endpoint
      activeUsers: 0,
      totalProjects: 0, // This would come from project count endpoint
      storageUsedGB: 0
    },
    isActive: org.status === 'ACTIVE',
    createdAt: new Date(org.createdAt),
    updatedAt: new Date(org.updatedAt || org.createdAt),
    createdBy: org.createdByUser || org.createdBy,
    // Additional fields from API
    description: org.description,
    address: org.address,
    phone: org.phone,
    email: org.email,
    website: org.website,
    logoUrl: org.logoUrl
  }));
};

// Get organizations with transformed data
export const getOrganizationsForUI = async (params = {}) => {
  try {
    const {
      searchKey = '',
      status = '',
      limit = 10,
      pageNo = 1,
      sortField = 'createdAt',
      sortOrder = 'DESC'
    } = params;

    const response = await getOrganizations(searchKey, status, limit, pageNo, sortField, sortOrder);
    
    return {
      data: transformOrganizationData(response.data),
      info: response.info || { totalCount: 0 }
    };
  } catch (error) {
    console.error('Error fetching organizations for UI:', error);
    throw error;
  }
};