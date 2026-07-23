import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CourseList from '../pages/CourseList';
import CourseDetail from '../pages/CourseDetail';
import BlogList from '../pages/BlogList';
import BlogDetail from '../pages/BlogDetail';
import AuthPage from '../pages/AuthPage';
import FaqPage from '../pages/FaqPage';
import ContactPage from '../pages/ContactPage';
import StudentDashboard from '../pages/StudentDashboard';
import InstructorList from '../pages/InstructorList';
import TeacherDashboard from '../components/TeacherDashboard';

// Admin pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import StudentManagement from '../pages/admin/StudentManagement';
import TutorVerification from '../pages/admin/TutorVerification';
import CourseModeration from '../pages/admin/CourseModeration';
import TransactionHistory from '../pages/admin/TransactionHistory';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:articleId" element={<BlogDetail />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/instructors" element={<InstructorList />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

      {/* Admin Panel routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/students" element={<StudentManagement />} />
      <Route path="/admin/tutors" element={<TutorVerification />} />
      <Route path="/admin/courses" element={<CourseModeration />} />
      <Route path="/admin/payouts" element={<TransactionHistory />} />
    </Routes>
  );
};

export default AppRoutes;
