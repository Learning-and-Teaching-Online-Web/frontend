export interface Tutor {
  tutor_id: string;
  name: string;
  avatar: string;
}

export interface Course {
  course_id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  oldPrice?: number;
  isFree: boolean;
  duration: string;
  studentsCount: number;
  rating: number;
  reviewCount: number;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  categories: string[];
  instructor: string;
  thumbnail: string;
  lessonsCount: number;
  quizzesCount: number;
}

export const mockCourses: Course[] = [];
