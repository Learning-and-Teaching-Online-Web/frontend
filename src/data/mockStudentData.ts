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

// Initial mock data
export const initialStudentProfile: StudentProfile = {
  student_id: "stud-2026-999",
  fullName: "Nguyễn Văn Học",
  email: "hoc.nguyen@novalearn.edu.vn",
  phone: "0987654321",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  grade_level: "Lớp 11",
  learning_goals: "Muốn nâng cao kỹ năng thiết kế đồ họa và nhiếp ảnh để thi đậu chứng chỉ quốc tế và hoàn thành dự án cá nhân.",
  preferred_subjects: ["Photography", "Design"],
  preferred_mode: "both",
  budget_min: 100000,
  budget_max: 1000000,
  joinedAt: "2026-01-15T08:00:00.000Z"
};

export const mockEnrolledCourses: EnrolledCourse[] = [
  {
    course_id: "course-1",
    title: "Create An LMS Website With LearnPress",
    subject: "Photography",
    instructor: "Kenny White",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    progress: 75,
    completedLessons: 15,
    totalLessons: 20,
    nextSessionTime: "2026-07-16T15:00:00.000Z"
  },
  {
    course_id: "course-2",
    title: "The Ultimate Guide To The Best WordPress LMS Plugin",
    subject: "Photography",
    instructor: "Determined-Poitras",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    progress: 30,
    completedLessons: 6,
    totalLessons: 20,
    nextSessionTime: "2026-07-17T09:30:00.000Z"
  },
  {
    course_id: "course-4",
    title: "Building Modern E-Commerce Sites with WooCommerce",
    subject: "Design",
    instructor: "Kenny White",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
    progress: 95,
    completedLessons: 24,
    totalLessons: 25,
    nextSessionTime: "2026-07-15T22:30:00.000Z" // Starts in ~1 hour relative to current user time (2026-07-15T21:22:24)
  }
];

// 3 mock class sessions: one starting very soon, one tomorrow, one yesterday (completed)
export const mockClassSessions: ClassSession[] = [
  {
    session_id: "sess-001",
    courseTitle: "Building Modern E-Commerce Sites with WooCommerce",
    tutorName: "Kenny White",
    tutorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    startTime: "2026-07-15T22:30:00.000Z", // Scheduled class soon
    endTime: "2026-07-15T23:30:00.000Z",
    status: "scheduled",
    meetingLink: "https://meet.jit.si/novalearn-woocommerce-kenny"
  },
  {
    session_id: "sess-002",
    courseTitle: "Create An LMS Website With LearnPress",
    tutorName: "Kenny White",
    tutorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    startTime: "2026-07-16T15:00:00.000Z", // Tomorrow
    endTime: "2026-07-16T16:00:00.000Z",
    status: "scheduled",
    meetingLink: "https://meet.jit.si/novalearn-learnpress-kenny"
  },
  {
    session_id: "sess-003",
    courseTitle: "The Ultimate Guide To The Best WordPress LMS Plugin",
    tutorName: "Determined-Poitras",
    tutorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    startTime: "2026-07-14T09:30:00.000Z", // Yesterday
    endTime: "2026-07-14T10:30:00.000Z",
    status: "completed",
    meetingLink: "https://meet.jit.si/novalearn-lmsplugin-poitras"
  }
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    attempt_id: "attempt-101",
    quizTitle: "Kiểm tra kiến thức cơ bản về Photography",
    courseTitle: "Create An LMS Website With LearnPress",
    score: 8.5,
    totalPoints: 10,
    isPassed: true,
    completedAt: "2026-07-13T14:30:00.000Z"
  },
  {
    attempt_id: "attempt-102",
    quizTitle: "WooCommerce Setup và Cấu hình",
    courseTitle: "Building Modern E-Commerce Sites with WooCommerce",
    score: 9.0,
    totalPoints: 10,
    isPassed: true,
    completedAt: "2026-07-14T16:00:00.000Z"
  },
  {
    attempt_id: "attempt-103",
    quizTitle: "WordPress Hooks & Filters nâng cao",
    courseTitle: "The Ultimate Guide To The Best WordPress LMS Plugin",
    score: 4.5,
    totalPoints: 10,
    isPassed: false,
    completedAt: "2026-07-12T10:15:00.000Z"
  }
];

export const mockFavoriteTutors: FavoriteTutor[] = [
  {
    tutor_id: "tutor-1",
    name: "Kenny White",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    subject: "Photography & WooCommerce",
    rating: 4.9,
    reviewCount: 124,
    hourlyRate: 250000,
    bio: "Hơn 8 năm kinh nghiệm giảng dạy nhiếp ảnh và phát triển website trên nền tảng WordPress. Luôn mang lại không khí vui vẻ và thực tế."
  },
  {
    tutor_id: "tutor-2",
    name: "Determined-Poitras",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    subject: "Web Development & LMS Architectures",
    rating: 4.8,
    reviewCount: 98,
    hourlyRate: 350000,
    bio: "Chuyên gia về các hệ thống E-learning quy mô lớn. Sẽ giúp bạn làm chủ cấu trúc theme và plugin WordPress từ số 0."
  }
];
