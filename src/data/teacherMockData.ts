export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  activeSchedules: number;
  walletBalance: number;
}

export interface MockSchedule {
  schedule_id: string;
  course_id?: string;
  course_title?: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  student_name?: string | null;
}

export interface MockDocument {
  doc_id: string;
  title: string;
  file_url: string;
  file_type: string;
  size: string;
}

export interface MockQuiz {
  quiz_id: string;
  title: string;
  status: 'published' | 'draft';
  questions_count: number;
}

export interface TeacherCourse {
  course_id: string;
  title: string;
  subject: string;
  price: number;
  status: 'published' | 'draft' | 'hidden';
  thumbnail_url: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  duration_minutes: number;
  total_sessions: number;
  studentsCount: number;
  rating: number;
  created_at: string;
  schedules: MockSchedule[];
  documents: MockDocument[];
  quizzes: MockQuiz[];
}

export interface TeacherBooking {
  booking_id: string;
  student_name: string;
  student_email: string;
  student_avatar: string;
  course_id: string;
  course_title: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  amount: number;
  created_at: string;
}

export interface TeacherReview {
  review_id: string;
  student_name: string;
  student_avatar: string;
  course_title: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface TeacherTransaction {
  transaction_id: string;
  type: 'earning' | 'withdrawal';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  description: string;
  created_at: string;
}

// ----------------------------------------------------
// INITIAL MOCK DATASETS
// ----------------------------------------------------

export const initialTeacherStats: TeacherStats = {
  totalCourses: 0,
  totalStudents: 0,
  totalEarnings: 0,
  averageRating: 0,
  activeSchedules: 0,
  walletBalance: 0,
};

export const initialTeacherCourses: TeacherCourse[] = [];
export const initialTeacherBookings: TeacherBooking[] = [];
export const initialTeacherReviews: TeacherReview[] = [];
export const initialTeacherTransactions: TeacherTransaction[] = [];
