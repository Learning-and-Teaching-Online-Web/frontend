import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { DashboardSidebar } from '../components/student/DashboardSidebar';
import { OverviewTab } from '../components/student/tabs/OverviewTab';
import { CoursesTab } from '../components/student/tabs/CoursesTab';
import { ScheduleTab } from '../components/student/tabs/ScheduleTab';
import { QuizzesTab } from '../components/student/tabs/QuizzesTab';
import { FavoritesTab } from '../components/student/tabs/FavoritesTab';
import { ProfileTab } from '../components/student/tabs/ProfileTab';
import '../styles/StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    profile,
    enrolledCourses,
    classSessions,
    quizAttempts,
    favoriteTutors,
    formState,
    formSetters,
    handlers,
    helpers,
    computed
  } = useStudentDashboard();

  if (!isAuthenticated) {
    return (
      <div className="dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <Clock className="spin-icon" size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h3>Đang kiểm tra thông tin đăng nhập...</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Vui lòng đăng nhập để xem thông tin học tập.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Bảng điều khiển học viên</span>
        </div>
      </div>

      <div className="dashboard-container container">
        {/* Left Sidebar */}
        <DashboardSidebar
          profile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handlers.handleLogout}
          quizCount={quizAttempts.length}
          favoriteCount={favoriteTutors.length}
        />

        {/* Right Content Area */}
        <main className="dashboard-content-card">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <OverviewTab
              profile={profile}
              enrolledCourses={enrolledCourses}
              classSessions={classSessions}
              quizAttempts={quizAttempts}
              nextSession={computed.nextSession}
              avgQuizScore={computed.avgQuizScore}
              mockStudyHours={computed.mockStudyHours}
              formatDate={helpers.formatDate}
              formatTime={helpers.formatTime}
            />
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === 'courses' && (
            <CoursesTab
              enrolledCourses={enrolledCourses}
              formatDate={helpers.formatDate}
            />
          )}

          {/* TAB 3: ONLINE CLASS SCHEDULE */}
          {activeTab === 'schedule' && (
            <ScheduleTab
              classSessions={classSessions}
              formatTime={helpers.formatTime}
            />
          )}

          {/* TAB 4: QUIZZES */}
          {activeTab === 'quizzes' && (
            <QuizzesTab
              quizAttempts={quizAttempts}
              handleSimulateQuiz={handlers.handleSimulateQuiz}
              formatDate={helpers.formatDate}
            />
          )}

          {/* TAB 5: FAVORITE TUTORS */}
          {activeTab === 'favorites' && (
            <FavoritesTab
              favoriteTutors={favoriteTutors}
              handleRemoveFavorite={handlers.handleRemoveFavorite}
            />
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              formState={formState}
              formSetters={formSetters}
              handlers={handlers}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
