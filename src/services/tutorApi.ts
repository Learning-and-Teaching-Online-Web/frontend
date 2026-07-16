import axiosClient from './axiosClient';

export const tutorApi = {
  getAll: async () => {
    const response = await axiosClient.get('/tutors');
    return response.data;
  },

  getById: async (tutorId: string) => {
    const response = await axiosClient.get(`/tutors/${tutorId}`);
    return response.data;
  }
};
