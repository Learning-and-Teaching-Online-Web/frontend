import axiosClient from './axiosClient';

export const mapBackendCourseToFrontend = (beCourse: any) => {
  const isFree = Number(beCourse.price) === 0;
  return {
    course_id: beCourse.course_id,
    title: beCourse.title,
    subject: beCourse.subject,
    description: beCourse.description || '',
    price: Number(beCourse.price),
    oldPrice: beCourse.oldPrice || undefined,
    isFree: isFree,
    duration: `${beCourse.total_sessions || 1} Buổi (${beCourse.duration_minutes || 60} Phút/Buổi)`,
    studentsCount: beCourse.max_students || 0,
    rating: Number(beCourse.tutor?.rating) || 5,
    reviewCount: beCourse.tutor?.review_count || 0,
    level: beCourse.level || 'Beginner',
    categories: Array.isArray(beCourse.tags) ? beCourse.tags : (beCourse.tags ? JSON.parse(JSON.stringify(beCourse.tags)) : []),
    instructor: beCourse.tutor?.user?.full_name || 'Giảng viên',
    instructorAvatar: beCourse.tutor?.user?.avatar_url || null,
    instructorBio: beCourse.tutor?.bio || null,
    instructorSpecialization: beCourse.tutor?.specialization || null,
    thumbnail: beCourse.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
    lessonsCount: beCourse.total_sessions || 0,
    quizzesCount: beCourse.quizzes?.length || 0,
    schedules: beCourse.schedules || [],
    tutor_id: beCourse.tutor_id || '',
  };
};

export const courseApi = {
  getAll: async (params?: any) => {
    const response = await axiosClient.get('/courses', { params });
    return response.data;
  },

  getDetail: async (courseId: string) => {
    const response = await axiosClient.get(`/courses/${courseId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axiosClient.post('/courses', data);
    return response.data;
  },

  update: async (courseId: string, data: any) => {
    const response = await axiosClient.patch(`/courses/${courseId}`, data);
    return response.data;
  },

  delete: async (courseId: string) => {
    const response = await axiosClient.delete(`/courses/${courseId}`);
    return response.data;
  },

  addSchedule: async (courseId: string, data: any) => {
    const response = await axiosClient.post(`/courses/${courseId}/schedules`, data);
    return response.data;
  }
};
