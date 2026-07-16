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
    </Routes>
  );
};

export default AppRoutes;
