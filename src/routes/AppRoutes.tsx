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
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Admin pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import StudentManagement from '../pages/admin/StudentManagement';
import TutorVerification from '../pages/admin/TutorVerification';
import CourseModeration from '../pages/admin/CourseModeration';
import TransactionHistory from '../pages/admin/TransactionHistory';
import ArticleManagement from '../pages/admin/ArticleManagement';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:articleId" element={<BlogDetail />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/instructors" element={<InstructorList />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} redirectPath="/auth" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Protected Tutor routes */}
      <Route element={<ProtectedRoute allowedRoles={['tutor', 'admin']} redirectPath="/auth" />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      </Route>

      {/* Protected Admin Panel routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} redirectPath="/admin/login" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/tutors" element={<TutorVerification />} />
        <Route path="/admin/courses" element={<CourseModeration />} />
        <Route path="/admin/articles" element={<ArticleManagement />} />
        <Route path="/admin/payouts" element={<TransactionHistory />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
