import axiosClient from './axiosClient';

export const quizApi = {
  getMyAttempts: async () => {
    const response = await axiosClient.get('/quizzes/my-attempts');
    return response.data;
  },

  simulateAttempt: async (data: {
    courseId: string;
    quizTitle: string;
    score: number;
    totalPoints: number;
    isPassed: boolean;
  }) => {
    const response = await axiosClient.post('/quizzes/simulate', data);
    return response.data;
  }
};
export default quizApi;
