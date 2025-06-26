import { createContext, useContext, useReducer, useEffect } from 'react';
import { loginService } from '../api/authServices';
import { getMyAccount, transformUserData, checkPermission, getPermittedRoutes } from '../api/userService';
import { getAccessToken, removeTokens, isAuthenticated } from '../services/storageService';

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null,
  userDetails: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userDetails: action.payload.userDetails,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userDetails: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userDetails: null,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        userDetails: action.payload.userDetails,
        isAuthenticated: true,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status and fetch user details on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        if (authenticated) {
          // Fetch user details from my-account API
          const userResponse = await getMyAccount();
          
          if (userResponse.success && userResponse.data) {
            const transformedUser = transformUserData(userResponse.data);
            
            dispatch({
              type: 'SET_USER',
              payload: {
                user: {
                  email: transformedUser.email,
                  firstName: transformedUser.firstName,
                  lastName: transformedUser.lastName,
                  role: transformedUser.role,
                },
                userDetails: transformedUser,
              },
            });
          } else {
            // Token exists but API call failed, likely invalid token
            removeTokens();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's an error fetching user details, clear tokens
        removeTokens();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await loginService(email, password);
      
      // After successful login, fetch user details
      const userResponse = await getMyAccount();
      
      if (userResponse.success && userResponse.data) {
        const transformedUser = transformUserData(userResponse.data);
        
        const userData = {
          email: transformedUser.email,
          firstName: transformedUser.firstName,
          lastName: transformedUser.lastName,
          role: transformedUser.role,
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { 
            user: userData,
            userDetails: transformedUser,
          },
        });
      } else {
        throw new Error('Failed to fetch user details after login');
      }

      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Incorrect username or password.';
      
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage,
      });
      
      throw error;
    }
  };

  const logout = () => {
    try {
      removeTokens();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Role-based permission utilities
  const hasPermission = (permission) => {
    const userRole = state.userDetails?.role;
    return checkPermission(userRole, permission);
  };

  const getPermissions = () => {
    const userRole = state.userDetails?.role;
    return getPermittedRoutes(userRole);
  };

  const value = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    userDetails: state.userDetails,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
    
    // Role-based utilities
    hasPermission,
    getPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// For backward compatibility with old UI patterns
export function useAuthContext() {
  return useAuth();
}

export default AuthContext;