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

export const mockCourses: Course[] = [
  {
    course_id: "course-1",
    title: "Create An LMS Website With LearnPress",
    subject: "Photography",
    description: "LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online. You can create a course curriculum with lessons & quizzes included which is managed with an easy-to-use interface for users.",
    price: 0,
    oldPrice: 29.0,
    isFree: true,
    duration: "2Weeks",
    studentsCount: 156,
    rating: 4,
    reviewCount: 1025,
    level: "Intermediate",
    categories: ["Shop", "Academy"],
    instructor: "Kenny White",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 20,
    quizzesCount: 3
  },
  {
    course_id: "course-2",
    title: "The Ultimate Guide To The Best WordPress LMS Plugin",
    subject: "Photography",
    description: "This ultimate guide will walk you through setting up, designing, and optimizing your LearnPress LMS website. Perfect for beginners and advanced web developers who want a quick, scalable, and premium online course site.",
    price: 49.0,
    oldPrice: 89.0,
    isFree: false,
    duration: "2Weeks",
    studentsCount: 156,
    rating: 5,
    reviewCount: 1025,
    level: "Intermediate",
    categories: ["Academy", "Shop"],
    instructor: "Determined-Poitras",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 20,
    quizzesCount: 3
  },
  {
    course_id: "course-3",
    title: "Digital Photography Masterclass for Creative Minds",
    subject: "Photography",
    description: "A comprehensive course designed to teach you the fundamentals of digital photography. Learn aperture, shutter speed, ISO, composition rules, and how to tell stories through beautiful visuals.",
    price: 0,
    oldPrice: 39.0,
    isFree: true,
    duration: "2Weeks",
    studentsCount: 156,
    rating: 5,
    reviewCount: 1025,
    level: "Beginner",
    categories: ["Commercial", "Studio"],
    instructor: "John Doe",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 15,
    quizzesCount: 2
  },
  {
    course_id: "course-4",
    title: "Building Modern E-Commerce Sites with WooCommerce",
    subject: "Design",
    description: "Step-by-step tutorial on how to install, configure, and customize WooCommerce. Setup products, payment gateways (including ZaloPay, Stripe), wallets, and automatic platform commission calculations.",
    price: 29.0,
    isFree: false,
    duration: "4Weeks",
    studentsCount: 340,
    rating: 4,
    reviewCount: 180,
    level: "Intermediate",
    categories: ["Shop", "Commercial"],
    instructor: "Kenny White",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 25,
    quizzesCount: 5
  },
  {
    course_id: "course-5",
    title: "Office Productivity Suite and Document Management",
    subject: "Office",
    description: "Master document classification, extraction, and chunking for advanced searches. Ideal for administrators, office managers, and team leads looking to digitize their workflow.",
    price: 19.0,
    isFree: false,
    duration: "3Weeks",
    studentsCount: 88,
    rating: 3,
    reviewCount: 92,
    level: "Beginner",
    categories: ["Office", "Educate"],
    instructor: "John Doe",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 10,
    quizzesCount: 1
  },
  {
    course_id: "course-6",
    title: "Enterprise Systems and University Level Programming",
    subject: "Academy",
    description: "Advanced programming lectures covering clean architecture, layered routing, controllers, services, database constraints, multi-schema designs, and RLS policies.",
    price: 120.0,
    oldPrice: 150.0,
    isFree: false,
    duration: "6Weeks",
    studentsCount: 1025,
    rating: 5,
    reviewCount: 1250,
    level: "Expert",
    categories: ["University", "Academy"],
    instructor: "Kenny White",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60",
    lessonsCount: 40,
    quizzesCount: 8
  }
];
