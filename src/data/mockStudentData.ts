export interface StudentProfile {
  student_id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  grade_level: string;
  learning_goals: string;
  preferred_subjects: string[];
  preferred_mode: 'online' | 'offline' | 'both';
  budget_min: number;
  budget_max: number;
  joinedAt: string;
}

export interface EnrolledCourse {
  course_id: string;
  title: string;
  subject: string;
  instructor: string;
  thumbnail: string;
  progress: number; // 0 to 100
  completedLessons: number;
  totalLessons: number;
  nextSessionTime?: string;
}

export interface ClassSession {
  session_id: string;
  booking_id?: string;
  courseTitle: string;
  tutorName: string;
  tutorAvatar: string;
  startTime: string; // ISO format string
  endTime: string;   // ISO format string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink: string;
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
  grade_level: "",
  learning_goals: "",
  preferred_subjects: [],
  preferred_mode: "both",
  budget_min: 0,
  budget_max: 1000000,
  joinedAt: new Date().toISOString()
};

export const mockEnrolledCourses: EnrolledCourse[] = [];
export const mockClassSessions: ClassSession[] = [];
export const mockQuizAttempts: QuizAttempt[] = [];
export const mockFavoriteTutors: FavoriteTutor[] = [];
