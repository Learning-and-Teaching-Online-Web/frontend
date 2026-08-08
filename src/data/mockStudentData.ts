export interface StudentProfile {
  student_id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  gender: string;
  date_of_birth: string;
  grade_level: string;
  academic_level: string;
  province: string;
  district: string;
  address_detail: string;
  joinedAt: string;
}

export interface EnrolledCourse {
  course_id: string;
  booking_id?: string;
  type?: 'online' | 'offline';
  title: string;
  subject: string;
  instructor: string;
  thumbnail: string;
  progress: number; // 0 to 100
  completedLessons: number;
  totalLessons: number;
  nextSessionTime?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  isReviewed?: boolean;
}

export interface ClassSession {
  session_id: string;
  booking_id?: string;
  course_id?: string;
  type?: 'online' | 'offline';
  courseTitle: string;
  tutorName: string;
  tutorAvatar: string;
  startTime: string; // ISO format string
  endTime: string;   // ISO format string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink: string;
  bookingStatus?: string;
  paymentStatus?: string;
  isReviewed?: boolean;
}

export interface QuizAttempt {
  attempt_id: string;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalPoints: number;
  isPassed: boolean;
  completedAt: string;
}

export interface FavoriteTutor {
  tutor_id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  bio: string;
}

// Default student profile structure
export const initialStudentProfile: StudentProfile = {
  student_id: "",
  fullName: "",
  email: "",
  phone: "",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  gender: "male",
  date_of_birth: "",
  grade_level: "Lớp 11",
  academic_level: "Khá",
  province: "",
  district: "",
  address_detail: "",
  joinedAt: new Date().toISOString()
};

export const mockEnrolledCourses: EnrolledCourse[] = [];
export const mockClassSessions: ClassSession[] = [];
export const mockQuizAttempts: QuizAttempt[] = [];
export const mockFavoriteTutors: FavoriteTutor[] = [];
