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
import { ClassRequestsTab } from '../components/student/tabs/ClassRequestsTab';
import { WalletTab } from '../components/student/tabs/WalletTab';
import '../styles/StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    activeTab,
    setActiveTab,
    profile,
    enrolledCourses,
    classSessions,
    quizAttempts,
    favoriteTutors,
    myClassRequests,
    fetchMyClassRequests,
    walletBalance,
    walletTransactions,
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

  if (isLoading && enrolledCourses.length === 0 && classSessions.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#ff7a3d', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
          <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>Đang đồng bộ dữ liệu học tập...</p>
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
          classRequestCount={myClassRequests.length}
          handleAvatarFileChange={handlers.handleAvatarFileChange}
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
              onPay={handlers.handlePayBooking}
            />
          )}

          {/* TAB 3: ONLINE CLASS SCHEDULE */}
          {activeTab === 'schedule' && (
            <ScheduleTab
              classSessions={classSessions}
              formatTime={helpers.formatTime}
            />
          )}

          {/* TAB 4: MY CLASS REQUESTS */}
          {activeTab === 'class-requests' && (
            <ClassRequestsTab
              classRequests={myClassRequests}
              onRefresh={fetchMyClassRequests}
            />
          )}

          {/* TAB 5: QUIZZES */}
          {activeTab === 'quizzes' && (
            <QuizzesTab
              quizAttempts={quizAttempts}
              handleSimulateQuiz={handlers.handleSimulateQuiz}
              formatDate={helpers.formatDate}
            />
          )}

          {/* TAB 6: FAVORITE TUTORS */}
          {activeTab === 'favorites' && (
            <FavoritesTab
              favoriteTutors={favoriteTutors}
              handleRemoveFavorite={handlers.handleRemoveFavorite}
            />
          )}

          {/* TAB 7: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              formState={formState}
              formSetters={formSetters}
              handlers={handlers}
            />
          )}

          {/* TAB 8: PERSONAL WALLET */}
          {activeTab === 'wallet' && (
            <WalletTab
              balance={walletBalance}
              transactions={walletTransactions}
              onDeposit={handlers.handleDeposit}
              formatDate={helpers.formatDate}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
