import axiosInstance from './axiosInstance';
import { setToken } from '../services/storageService';

// Admin login service (existing admin login functionality)
export const loginService = async (email, password) => {
  try {
    const response = await axiosInstance.post(
      "/admin/auth/login",
      {
        email,
        password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    
    if (response?.data?.data) {
      setToken(
        response?.data?.data?.accessToken,
        response?.data?.data?.refreshToken
      );
      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

// Keep backward compatibility
export const adminLoginService = loginService;

// Get Firebase token for custom authentication
export const getFirebaseToken = async () => {
  try {
    const response = await axiosInstance.get('/admin/auth/firebase-token');

    if (response?.data?.data) {
      return response.data;
    } else {
      console.error("Firebase token fetch failed: No data received");
      throw new Error("Firebase token fetch failed");
    }
  } catch (error) {
    console.error("Error fetching Firebase token:", error);
    throw error;
  }
};

// Reset password token
export const resetPasswordToken = async (email = "") => {
  try {
    const response = await axiosInstance.post(
      "/admin/auth/reset-password/token",
      {
        email,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    
    if (response?.data?.data) {
      return response.data;
    } else {
      throw new Error("Reset password request failed");
    }
  } catch (error) {
    console.error("Reset password token error:", error);
    throw error;
  }
};

// Validate reset password token
export const validateToken = async (token) => {
  try {
    const response = await axiosInstance.post(
      "/admin/auth/reset-password/token-validate",
      {
        token: token,
      }
    );
    
    if (response?.data?.data) {
      return response.data;
    } else {
      throw new Error("Token validation failed");
    }
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (password, token) => {
  try {
    const response = await axiosInstance.post(
      "/admin/auth/reset-password",
      {
        password: password,
        token: token,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    
    if (response?.data?.data) {
      return response.data;
    } else {
      throw new Error("Password reset failed");
    }
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// Verify user token
export const verifyUser = async (token) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token");
    }
    
    const response = await axiosInstance.post(
      "/admin/auth/verify-user",
      { token },
      { headers: { "Content-Type": "application/json" } }
    );
    
    if (response?.data) {
      return response.data;
    } else {
      throw new Error("Verification failed: No data in response");
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    throw new Error(
      error?.response?.data?.message || error.message || "Verification failed"
    );
  }
};

// Refresh token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post('/admin/auth/refresh', {
      refreshToken,
    });
    
    if (response?.data?.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      setToken(accessToken, newRefreshToken);
      return response.data;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};