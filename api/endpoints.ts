export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    SETTINGS: '/user/settings',
    UPLOAD_CONTENT: '/user/upload-content',
  },
  CONTENT: {
    ANALYZE: '/api/analyze',
  },
  // Add other endpoint groups
} as const;
