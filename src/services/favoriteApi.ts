import axiosClient from './axiosClient';

export const favoriteApi = {
  getMyFavorites: async () => {
    const response = await axiosClient.get('/favorites/my-favorites');
    return response.data;
  },

  toggleFavorite: async (tutorId: string) => {
    const response = await axiosClient.post('/favorites', { tutorId });
    return response.data;
  }
};
export default favoriteApi;
