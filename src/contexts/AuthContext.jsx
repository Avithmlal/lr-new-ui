import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loginService } from '../api/authServices';
import { getAccessToken, removeTokens, isAuthenticated } from '../services/storageService';

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null,
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
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
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
        user: action.payload,
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

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated();
        if (authenticated) {
          // User has valid token, set as authenticated
          // In a real app, you might want to validate the token with the server
          dispatch({
            type: 'SET_USER',
            payload: {
              // You can decode token or fetch user info here
              email: 'admin@leaproad.com', // Placeholder
              role: 'admin',
            },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await loginService(email, password);
      
      // Extract user info from response
      const userData = {
        email: email,
        role: 'admin', // You can get this from response if available
        ...response.data?.user, // Include any user data from response
      };

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: userData },
      });

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

  const value = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
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