import axiosClient from './axiosClient';

export interface CreateArticlePayload {
  title: string;
  excerpt: string;
  content: string | string[];
  category: string;
  imageType?: string;
  tags?: string[] | string;
  author?: string;
}

export const blogApi = {
  getAll: async () => {
    const response = await axiosClient.get('/blog');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/blog/${id}`);
    return response.data;
  },

  create: async (data: CreateArticlePayload) => {
    const response = await axiosClient.post('/blog', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateArticlePayload>) => {
    const response = await axiosClient.put(`/blog/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/blog/${id}`);
    return response.data;
  }
};

export default blogApi;
