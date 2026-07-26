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
    phone: string;
    gender: string;
    dateOfBirth: string;
    role: 'student' | 'tutor';
  }) => {
    const response = await axiosClient.post('/auth/signup', data);
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
