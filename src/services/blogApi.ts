import axiosClient from './axiosClient';

export const blogApi = {
  getAll: async () => {
    const response = await axiosClient.get('/blog');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/blog/${id}`);
    return response.data;
  }
};
export default blogApi;
