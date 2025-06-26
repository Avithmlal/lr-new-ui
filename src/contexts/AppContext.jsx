import { createContext, useContext, useReducer } from 'react';

const initialState = {
  projects: [],
  selectedProject: null,
  avatars: [],
  selectedAvatar: null,
  interactionLogs: [],
  systemMessages: [],
  activeTasks: {},
  videos: [], // Add videos to initial state
  // User & Admin State
  currentUser: {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: {
      type: 'admin', // Can be 'admin', 'org_admin', 'user'
      permissions: [
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'organizations', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'system', actions: ['read', 'update'] },
      ]
    },
    organizationId: '1',
    isActive: true,
    lastLoginAt: new Date(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        push: true,
        projectUpdates: true,
        courseGeneration: true,
      }
    },
    usage: {
      projectsCreated: 12,
      coursesGenerated: 34,
      mediaAssetsUploaded: 156,
      billySessionsCount: 89,
      storageUsedMB: 2340,
      lastActivityAt: new Date(),
    }
  },
  users: [],
  organizations: [],
  adminStats: null,
  // Knowledge Gather Plans State
  knowledgeGatherPlans: [],
  knowledgeGatherEnrollments: [],
};

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'SELECT_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        selectedProject: state.selectedProject?.id === action.payload.id 
          ? action.payload 
          : state.selectedProject,
      };
    case 'ADD_MEDIA_ASSET':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? { ...p, mediaAssets: [...p.mediaAssets, action.payload.asset] }
            : p
        ),
      };
    case 'ADD_COURSE':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? { ...p, courses: [...p.courses, action.payload.course] }
            : p
        ),
      };
    case 'SET_AVATARS':
      return { ...state, avatars: action.payload };
    case 'SELECT_AVATAR':
      return { ...state, selectedAvatar: action.payload };
    case 'ADD_INTERACTION_LOG':
      return { ...state, interactionLogs: [...state.interactionLogs, action.payload] };
    case 'ADD_SYSTEM_MESSAGE':
      return { ...state, systemMessages: [action.payload, ...state.systemMessages] };
    case 'MARK_MESSAGE_READ':
      return {
        ...state,
        systemMessages: state.systemMessages.map(msg =>
          msg.id === action.payload ? { ...msg, isRead: true } : msg
        ),
      };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          [action.payload.taskId]: action.payload.status,
        },
      };
    // Video cases
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    case 'ADD_VIDEO':
      return { ...state, videos: [...(state.videos || []), action.payload] };
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: (state.videos || []).map(v => 
          v.id === action.payload.id ? action.payload : v
        ),
      };
    case 'DELETE_VIDEO':
      return {
        ...state,
        videos: (state.videos || []).filter(v => v.id !== action.payload),
      };
    // User & Admin Cases
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
      };
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload };
    case 'ADD_ORGANIZATION':
      return { ...state, organizations: [...state.organizations, action.payload] };
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.map(o => o.id === action.payload.id ? action.payload : o),
      };
    case 'DELETE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.filter(o => o.id !== action.payload),
      };
    case 'SET_ADMIN_STATS':
      return { ...state, adminStats: action.payload };
    // Knowledge Gather Plans Cases
    case 'SET_KNOWLEDGE_GATHER_PLANS':
      return { ...state, knowledgeGatherPlans: action.payload };
    case 'ADD_KNOWLEDGE_GATHER_PLAN':
      return { ...state, knowledgeGatherPlans: [...state.knowledgeGatherPlans, action.payload] };
    case 'UPDATE_KNOWLEDGE_GATHER_PLAN':
      return {
        ...state,
        knowledgeGatherPlans: state.knowledgeGatherPlans.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_KNOWLEDGE_GATHER_PLAN':
      return {
        ...state,
        knowledgeGatherPlans: state.knowledgeGatherPlans.filter(p => p.id !== action.payload),
      };
    case 'SET_KNOWLEDGE_GATHER_ENROLLMENTS':
      return { ...state, knowledgeGatherEnrollments: action.payload };
    case 'ADD_KNOWLEDGE_GATHER_ENROLLMENT':
      return { ...state, knowledgeGatherEnrollments: [...state.knowledgeGatherEnrollments, action.payload] };
    case 'UPDATE_KNOWLEDGE_GATHER_ENROLLMENT':
      return {
        ...state,
        knowledgeGatherEnrollments: state.knowledgeGatherEnrollments.map(e => 
          e.id === action.payload.id ? action.payload : e
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Utility function to check if user has permission
export function hasPermission(user, resource, action) {
  if (!user || !user.role || !user.role.permissions) return false;
  
  const permission = user.role.permissions.find(p => p.resource === resource);
  if (!permission) return false;
  
  return permission.actions.includes(action);
}

// Utility function to check if user is admin
export function isAdmin(user) {
  return user?.role?.type === 'admin';
}

// Utility function to check if user is org admin
export function isOrgAdmin(user) {
  return user?.role?.type === 'org_admin';
}