import axiosClient from './axiosClient';

export const authApi = {
  login: async (data: { identifier?: string; email?: string; username?: string; password: string }) => {
    // Tùy theo cấu trúc BE, có thể gửi email, username, hoặc identifier chung
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
  }
};
