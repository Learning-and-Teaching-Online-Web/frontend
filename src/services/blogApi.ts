import axiosClient from './axiosClient';

export interface CreateArticlePayload {
  title: string;
  excerpt: string;
  content: string | string[];
  category: string;
  category_id?: string;
  imageType?: string;
  tags?: string[] | string;
  author?: string;
}

export interface ArticleCategory {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  _count?: {
    articles: number;
  };
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

  // Categories
  getCategories: async (includeInactive = false) => {
    const response = await axiosClient.get(`/blog/categories${includeInactive ? '?all=true' : ''}`);
    return response.data;
  },

  createCategory: async (data: { name: string; slug?: string; description?: string; order_index?: number }) => {
    const response = await axiosClient.post('/blog/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<{ name: string; slug: string; description: string; order_index: number; is_active: boolean }>) => {
    const response = await axiosClient.put(`/blog/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axiosClient.delete(`/blog/categories/${id}`);
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
