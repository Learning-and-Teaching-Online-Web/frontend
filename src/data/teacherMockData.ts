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
  payment_status: 'paid' | 'unpaid';
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
  totalCourses: 3,
  totalStudents: 148,
  totalEarnings: 32450000, // 32.45M VND
  averageRating: 4.8,
  activeSchedules: 8,
  walletBalance: 8750000, // 8.75M VND
};

export const initialTeacherCourses: TeacherCourse[] = [
  {
    course_id: "t-course-1",
    title: "Xây dựng website e-commerce chuyên nghiệp với WooCommerce",
    subject: "Thiết kế & Web",
    price: 350000,
    status: "published",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
    level: "Intermediate",
    duration_minutes: 90,
    total_sessions: 12,
    studentsCount: 64,
    rating: 4.9,
    created_at: "2026-05-10",
    schedules: [
      { schedule_id: "sch-1", start_time: "2026-07-20T09:00:00+07:00", end_time: "2026-07-20T10:30:00+07:00", is_booked: true, student_name: "Nguyễn Văn Minh" },
      { schedule_id: "sch-2", start_time: "2026-07-22T14:00:00+07:00", end_time: "2026-07-22T15:30:00+07:00", is_booked: false, student_name: null }
    ],
    documents: [
      { doc_id: "doc-1", title: "Slide bài giảng thiết lập WooCommerce", file_url: "#", file_type: "pdf", size: "4.2 MB" },
      { doc_id: "doc-2", title: "Source code mẫu cấu hình thanh toán ZaloPay", file_url: "#", file_type: "zip", size: "1.8 MB" }
    ],
    quizzes: [
      { quiz_id: "quiz-1", title: "Kiểm tra kiến thức cơ bản về cổng thanh toán", status: "published", questions_count: 10 }
    ]
  },
  {
    course_id: "t-course-2",
    title: "Phát triển hệ thống Backend nâng cao với Clean Architecture",
    subject: "Lập trình hệ thống",
    price: 650000,
    status: "published",
    thumbnail_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60",
    level: "Expert",
    duration_minutes: 120,
    total_sessions: 20,
    studentsCount: 84,
    rating: 4.8,
    created_at: "2026-06-01",
    schedules: [
      { schedule_id: "sch-3", start_time: "2026-07-21T19:30:00+07:00", end_time: "2026-07-21T21:30:00+07:00", is_booked: true, student_name: "Trần Thị Hoa" },
      { schedule_id: "sch-4", start_time: "2026-07-23T19:30:00+07:00", end_time: "2026-07-23T21:30:00+07:00", is_booked: false, student_name: null }
    ],
    documents: [
      { doc_id: "doc-3", title: "Ebook Clean Architecture tiếng Việt", file_url: "#", file_type: "pdf", size: "12.5 MB" }
    ],
    quizzes: [
      { quiz_id: "quiz-2", title: "Trắc nghiệm về Controller vs Repository Pattern", status: "published", questions_count: 15 },
      { quiz_id: "quiz-3", title: "Bài thực hành thiết kế DB Schema", status: "draft", questions_count: 5 }
    ]
  },
  {
    course_id: "t-course-3",
    title: "Tối ưu hóa cơ sở dữ liệu PostgreSQL từ cơ bản đến thực chiến",
    subject: "Cơ sở dữ liệu",
    price: 480000,
    status: "draft",
    thumbnail_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&auto=format&fit=crop&q=60",
    level: "Intermediate",
    duration_minutes: 90,
    total_sessions: 10,
    studentsCount: 0,
    rating: 0,
    created_at: "2026-07-15",
    schedules: [],
    documents: [],
    quizzes: []
  }
];

export const initialTeacherBookings: TeacherBooking[] = [
  {
    booking_id: "book-1",
    student_name: "Nguyễn Văn Minh",
    student_email: "minhnv@gmail.com",
    student_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    course_id: "t-course-1",
    course_title: "Xây dựng website e-commerce chuyên nghiệp với WooCommerce",
    start_time: "2026-07-20T09:00:00+07:00",
    end_time: "2026-07-20T10:30:00+07:00",
    status: "pending",
    payment_status: "paid",
    amount: 350000,
    created_at: "2026-07-15T10:20:00+07:00"
  },
  {
    booking_id: "book-2",
    student_name: "Trần Thị Hoa",
    student_email: "hoatt@gmail.com",
    student_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    course_id: "t-course-2",
    course_title: "Phát triển hệ thống Backend nâng cao với Clean Architecture",
    start_time: "2026-07-21T19:30:00+07:00",
    end_time: "2026-07-21T21:30:00+07:00",
    status: "confirmed",
    payment_status: "paid",
    amount: 650000,
    created_at: "2026-07-14T15:45:00+07:00"
  },
  {
    booking_id: "book-3",
    student_name: "Lê Hoàng Long",
    student_email: "longlh@gmail.com",
    student_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    course_id: "t-course-1",
    course_title: "Xây dựng website e-commerce chuyên nghiệp với WooCommerce",
    start_time: "2026-07-22T14:00:00+07:00",
    end_time: "2026-07-22T15:30:00+07:00",
    status: "completed",
    payment_status: "paid",
    amount: 350000,
    created_at: "2026-07-10T08:15:00+07:00"
  },
  {
    booking_id: "book-4",
    student_name: "Phạm Minh Đức",
    student_email: "duchpm@gmail.com",
    student_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
    course_id: "t-course-2",
    course_title: "Phát triển hệ thống Backend nâng cao với Clean Architecture",
    start_time: "2026-07-23T19:30:00+07:00",
    end_time: "2026-07-23T21:30:00+07:00",
    status: "cancelled",
    payment_status: "refunded",
    amount: 650000,
    created_at: "2026-07-11T12:00:00+07:00"
  }
];

export const initialTeacherReviews: TeacherReview[] = [
  {
    review_id: "rev-1",
    student_name: "Nguyễn Văn Minh",
    student_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    course_title: "Xây dựng website e-commerce chuyên nghiệp với WooCommerce",
    rating: 5,
    comment: "Gia sư giảng dạy rất nhiệt tình, giải đáp toàn bộ thắc mắc của mình về cách tích hợp API thanh toán. Đáng đồng tiền bát gạo!",
    created_at: "2026-07-12"
  },
  {
    review_id: "rev-2",
    student_name: "Trần Thị Hoa",
    student_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    course_title: "Phát triển hệ thống Backend nâng cao với Clean Architecture",
    rating: 5,
    comment: "Kiến thức nâng cao và thực chiến, thầy dạy chậm rãi, giải thích cặn kẽ về Dependency Injection và thiết kế DB.",
    created_at: "2026-07-08"
  },
  {
    review_id: "rev-3",
    student_name: "Lê Hoàng Long",
    student_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    course_title: "Xây dựng website e-commerce chuyên nghiệp với WooCommerce",
    rating: 4.5,
    comment: "Tài liệu học tập đầy đủ và chi tiết. Có một số lỗi nhỏ trong source code nhưng thầy đã fix ngay sau đó.",
    created_at: "2026-07-05"
  }
];

export const initialTeacherTransactions: TeacherTransaction[] = [
  {
    transaction_id: "tx-1",
    type: "earning",
    amount: 585000, // 650000 - 10% platform fee
    status: "success",
    description: "Học phí từ Trần Thị Hoa (Backend Clean Architecture)",
    created_at: "2026-07-14T15:45:00+07:00"
  },
  {
    transaction_id: "tx-2",
    type: "earning",
    amount: 315000, // 350000 - 10% platform fee
    status: "success",
    description: "Học phí từ Nguyễn Văn Minh (E-Commerce WooCommerce)",
    created_at: "2026-07-13T10:20:00+07:00"
  },
  {
    transaction_id: "tx-3",
    type: "withdrawal",
    amount: 5000000,
    status: "success",
    description: "Yêu cầu rút tiền về tài khoản ngân hàng Techcombank",
    created_at: "2026-07-05T09:00:00+07:00"
  },
  {
    transaction_id: "tx-4",
    type: "earning",
    amount: 315000,
    status: "success",
    description: "Học phí từ Lê Hoàng Long (E-Commerce WooCommerce)",
    created_at: "2026-07-10T08:15:00+07:00"
  },
  {
    transaction_id: "tx-5",
    type: "withdrawal",
    amount: 3000000,
    status: "pending",
    description: "Yêu cầu rút tiền về tài khoản ngân hàng Techcombank",
    created_at: "2026-07-16T08:00:00+07:00"
  }
];
