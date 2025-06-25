// Token management functions
export const setToken = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const logout = () => {
  removeTokens();
  // Redirect to login page
  window.location.href = '/login';
};

// User preferences
export const setUserPreferences = (preferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

export const getUserPreferences = () => {
  const preferences = localStorage.getItem('userPreferences');
  return preferences ? JSON.parse(preferences) : null;
};

// App settings
export const setAppSetting = (key, value) => {
  localStorage.setItem(`app_${key}`, JSON.stringify(value));
};

export const getAppSetting = (key, defaultValue = null) => {
  const setting = localStorage.getItem(`app_${key}`);
  return setting ? JSON.parse(setting) : defaultValue;
};