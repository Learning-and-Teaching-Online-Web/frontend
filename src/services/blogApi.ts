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
  },

  // Comments
  getComments: async (articleId: string) => {
    const response = await axiosClient.get(`/blog/${articleId}/comments`);
    return response.data;
  },

  createComment: async (articleId: string, content: string) => {
    const response = await axiosClient.post(`/blog/${articleId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await axiosClient.delete(`/blog/comments/${commentId}`);
    return response.data;
  }
};

export default blogApi;
