import axiosClient from './axiosClient';

export const authApi = {
  login: async (data: { identifier?: string; email?: string; username?: string; password: string }) => {
    const response = await axiosClient.post('/auth/signin', data);
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    role?: 'student' | 'tutor';
  }) => {
    const response = await axiosClient.post('/auth/signup', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosClient.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await axiosClient.post('/auth/resend-verification', { email });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  },

  completeGoogleSignup: async (data: { email: string; fullName: string; role: 'student' | 'tutor'; googleId?: string }) => {
    const response = await axiosClient.post('/auth/google/complete', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (refreshToken?: string) => {
    const response = await axiosClient.post('/auth/signout', { refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    metadata?: any;
  }) => {
    const response = await axiosClient.patch('/auth/profile', data);
    return response.data;
  }
};

export default authApi;
