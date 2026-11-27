import axiosClient from './axiosClient';

export interface ClassroomAccessData {
  can_access: boolean;
  schedule_id: string;
  course_id: string;
  course_title: string;
  room_id: string;
  start_time: string;
  end_time: string;
  user_role: 'student' | 'tutor' | string;
  user_id: string;
}

export interface ClassroomAccessResponse {
  success: boolean;
  message?: string;
  data: ClassroomAccessData;
  error?: string;
}

export const classroomApi = {
  /**
   * GET /classroom/:scheduleId/access
   * Kiểm tra quyền vào lớp học trực tuyến
   */
  checkAccess: async (scheduleId: string): Promise<ClassroomAccessResponse> => {
    const response = await axiosClient.get<ClassroomAccessResponse>(`/classroom/${scheduleId}/access`);
    return response.data;
  }
};
