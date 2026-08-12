import React, { useRef } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  Star,
  CreditCard,
  X,
  DollarSign,
  Users,
  Award,
  Globe,
  PlayCircle,
  Sparkles,
  Info,
  Camera,
  ClipboardList
} from 'lucide-react';

import '../styles/TeacherDashboard.css';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { OverviewTab } from './teacher/tabs/OverviewTab';
import { CoursesTab } from './teacher/tabs/CoursesTab';
import { SchedulesTab } from './teacher/tabs/SchedulesTab';
import { BookingsTab } from './teacher/tabs/BookingsTab';
import { ArticlesTab } from './teacher/tabs/ArticlesTab';
import { ReviewsTab } from './teacher/tabs/ReviewsTab';
import { WalletTab } from './teacher/tabs/WalletTab';
import { ProfileTab } from './teacher/tabs/ProfileTab';
import { OfflineClassesTab } from './teacher/tabs/OfflineClassesTab';
import { VerificationBanner } from './teacher/VerificationBanner';
import { LessonManagementModal } from './teacher/LessonManagementModal';
import { DocumentManagementModal } from './teacher/DocumentManagementModal';

const TeacherDashboard: React.FC = () => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    activeTab,
    setActiveTab,
    isLoading,
    teacherName,
    handleAvatarUpload,
    stats,
    tutorProfile,
    courses,
    bookings,
    reviews,
    transactions,
    walletBalance,
    articles,
    loadDashboardData,

    formatVND,
    formatDateString,
    // Lesson Management Actions
    isLessonModalOpen, setIsLessonModalOpen,
    selectedCourseForLessons,
    courseLessons,
    newLessonTitle, setNewLessonTitle,
    newLessonUrl, setNewLessonUrl,
    newLessonDesc, setNewLessonDesc,
    editingLesson,
    handleEditLesson,
    cancelEditLesson,
    openLessonsModal,
    handleAddLessonSubmit,
    handleDeleteLesson,
    // Document Management Actions
    isDocumentModalOpen, setIsDocumentModalOpen,
    courseDocuments,
    newDocTitle, setNewDocTitle,
    newDocUrl, setNewDocUrl,
    newDocType, setNewDocType,
    newDocDesc, setNewDocDesc,
    editingDocument,
    openDocumentsModal,
    handleEditDocument,
    cancelEditDocument,
    handleAddDocumentSubmit,
    handleDeleteDocument,
    // Profile & Certificate Actions
    handleUpdateProfileSubmit,
    isCertModalOpen, setIsCertModalOpen,
    certTitle, setCertTitle,
    certFileUrl, setCertFileUrl,
    selectedCertFile, setSelectedCertFile,
    certFileType, setCertFileType,
    certIssuedBy, setCertIssuedBy,
    certIssuedDate, setCertIssuedDate,
    certExpiryDate, setCertExpiryDate,
    openAddCertModal,
    handleAddCertSubmit,
    handleDeleteCert,
    // Modals & Course Actions
    isCourseModalOpen, setIsCourseModalOpen,
    editingCourse,
    openCreateCourseModal,
    openEditCourseModal,
    handleCourseSubmit,
    handleDeleteCourse,
    isWithdrawModalOpen, setIsWithdrawModalOpen,
    isArticleModalOpen, setIsArticleModalOpen,
    editingArticle,
    // Course Form
    newCourseTitle, setNewCourseTitle,
    newCourseSubject, setNewCourseSubject,
    newCoursePrice, setNewCoursePrice,
    newCourseType, setNewCourseType,
    newCourseStartDate,
    newCourseEndDate,
    handleStartDateChange,
    handleEndDateChange,
    newCourseLevel, setNewCourseLevel,
    newCourseSessions, setNewCourseSessions,
    newCourseDuration, setNewCourseDuration,
    newCourseDescription, setNewCourseDescription,
    newCourseThumbnail, setNewCourseThumbnail,
    newCourseMaxStudents, setNewCourseMaxStudents,
    newCourseStatus, setNewCourseStatus,
    newCourseScheduleDays, setNewCourseScheduleDays,
    newCourseStartTime, setNewCourseStartTime,
    newCourseEndTime, setNewCourseEndTime,


    // Withdraw Form
    withdrawAmount, setWithdrawAmount,
    withdrawBank, setWithdrawBank,
    withdrawAccount, setWithdrawAccount,
    handleWithdrawSubmit,
    // Article Form
    articleTitle, setArticleTitle,
    articleCategory, setArticleCategory,
    articleImageType, setArticleImageType,
    articleExcerpt, setArticleExcerpt,
    articleContent, setArticleContent,
    articleTags, setArticleTags,
    openCreateArticleModal,
    openEditArticleModal,
    handleArticleSubmit,
    handleDeleteArticle,
    // Booking Actions
    handleConfirmBooking,
    handleCancelBooking,
    classSessions
  } = useTeacherDashboard();

  if (isLoading && courses.length === 0 && bookings.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dashboard)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
          <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>Đang đồng bộ dữ liệu với cơ sở dữ liệu...</p>
        </div>
      </div>
    );
  }

  const rawDisplayName = tutorProfile?.full_name || tutorProfile?.user?.full_name || teacherName || 'Gia sư';
  const displayName = rawDisplayName.replace(/^Học viên\s+/i, '');
  const avatarUrl = tutorProfile?.avatar_url || tutorProfile?.user?.avatar_url;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* SIDEBAR NAVIGATION */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            {/* Hidden Avatar File Input */}
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />

            <div
              className="sidebar-avatar avatar-clickable"
              onClick={() => avatarInputRef.current?.click()}
              title="Nhấp vào đây để thay đổi ảnh đại diện gia sư"
              style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
              <div className="sidebar-avatar-overlay">
                <Camera size={18} color="#ffffff" />
              </div>
            </div>
            <h3 className="sidebar-name">{displayName}</h3>
            <span className="sidebar-role">Gia Sư Đối Tác</span>
          </div>

          <ul className="sidebar-menu">
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard size={18} />
                Tổng quan
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <BookOpen size={18} />
                Quản lý khóa học
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'schedules' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedules')}
              >
                <Calendar size={18} />
                Lịch dạy của tôi
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <CheckSquare size={18} />
                Yêu cầu học ({bookings.filter(b => b.status === 'pending').length})
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'offline_classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('offline_classes')}
              >
                <ClipboardList size={18} />
                Lớp offline cần dạy
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'articles' ? 'active' : ''}`}
                onClick={() => setActiveTab('articles')}
              >
                <FileText size={18} />
                Bài viết của tôi ({articles.length})
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={18} />
                Nhận xét học sinh
              </button>
            </li>
            <li>
              <button
                className={`menu-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <Award size={18} />
                Hồ sơ & Chứng chỉ
              </button>
            </li>
            <li>
              <button
                id="tab-btn-wallet"
                className={`menu-item-btn ${activeTab === 'wallet' ? 'active' : ''}`}
                onClick={() => setActiveTab('wallet')}
              >
                <CreditCard size={18} />
                Ví tiền & Doanh thu
              </button>
            </li>
          </ul>
        </aside>

        {/* MAIN DASHBOARD PANELS */}
        <main className="dashboard-main">

          {/* VERIFICATION STATUS BANNER */}
          <VerificationBanner
            status={tutorProfile?.verified_status || 'pending'}
            reason={tutorProfile?.admin_note}
            onGoToProfile={() => setActiveTab('profile')}
          />

          {/* STATS OVERVIEW CARDS */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-box earnings">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatVND(stats.totalEarnings)}</span>
                <span className="stat-label">Tổng thu nhập</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box students">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalStudents}</span>
                <span className="stat-label">Học sinh đăng ký</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box courses">
                <BookOpen size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalCourses}</span>
                <span className="stat-label">Khóa học của tôi</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box rating">
                <Star size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.averageRating} / 5</span>
                <span className="stat-label">Đánh giá gia sư</span>
              </div>
            </div>
          </section>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'overview' && (
            <OverviewTab
              bookings={bookings}
              walletBalance={walletBalance}
              formatVND={formatVND}
              formatDateString={formatDateString}
              setActiveTab={setActiveTab}
              setIsWithdrawModalOpen={setIsWithdrawModalOpen}
              handleConfirmBooking={handleConfirmBooking}
              handleCancelBooking={handleCancelBooking}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              tutorProfile={tutorProfile}
              handleUpdateProfileSubmit={handleUpdateProfileSubmit}
              openAddCertModal={openAddCertModal}
              handleDeleteCert={handleDeleteCert}
              formatVND={formatVND}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab
              courses={courses}
              formatVND={formatVND}
              openCreateCourseModal={openCreateCourseModal}
              openEditCourseModal={openEditCourseModal}
              openLessonsModal={openLessonsModal}
              openDocumentsModal={openDocumentsModal}
              handleDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'schedules' && (
            <SchedulesTab
              classSessions={classSessions}
              formatDateString={formatDateString}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              formatVND={formatVND}
              formatDateString={formatDateString}
              handleConfirmBooking={handleConfirmBooking}
              handleCancelBooking={handleCancelBooking}
            />
          )}

          {activeTab === 'articles' && (
            <ArticlesTab
              articles={articles}
              openCreateArticleModal={openCreateArticleModal}
              openEditArticleModal={openEditArticleModal}
              handleDeleteArticle={handleDeleteArticle}
              isArticleModalOpen={isArticleModalOpen}
              setIsArticleModalOpen={setIsArticleModalOpen}
              editingArticle={editingArticle}
              articleTitle={articleTitle} setArticleTitle={setArticleTitle}
              articleCategory={articleCategory} setArticleCategory={setArticleCategory}
              articleImageType={articleImageType} setArticleImageType={setArticleImageType}
              articleExcerpt={articleExcerpt} setArticleExcerpt={setArticleExcerpt}
              articleContent={articleContent} setArticleContent={setArticleContent}
              articleTags={articleTags} setArticleTags={setArticleTags}
              handleArticleSubmit={handleArticleSubmit}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} />
          )}

          {activeTab === 'wallet' && (
            <WalletTab
              walletBalance={walletBalance}
              transactions={transactions}
              formatVND={formatVND}
              setIsWithdrawModalOpen={setIsWithdrawModalOpen}
              loadDashboardData={loadDashboardData}
            />
          )}

          {activeTab === 'offline_classes' && (
            <OfflineClassesTab />
          )}
        </main>

      </div>

      {/* MODAL 1: CREATE / EDIT COURSE */}
      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#6366f1" />
                  {editingCourse ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '4px 0 0 0' }}>
                  {editingCourse ? 'Cập nhật thông tin nội dung và hình thức cho khóa học' : 'Thiết lập khóa học dạy trực tuyến Live hoặc chuỗi Bài giảng Video tự học'}
                </p>
              </div>
              <button onClick={() => setIsCourseModalOpen(false)} className="btn-close"><X size={20} /></button>
            </div>

            <form onSubmit={handleCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. VISUAL RADIO SELECTION: ONLINE VS OFFLINE */}
              <div className="form-group-db">
                <label style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Hình thức giảng dạy *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    onClick={() => { if (!editingCourse) setNewCourseType('online'); }}
                    style={{
                      border: newCourseType === 'online' ? '2px solid #6366f1' : '1px solid #cbd5e1',
                      background: newCourseType === 'online' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(79, 70, 229, 0.1))' : '#fff',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: editingCourse ? 'not-allowed' : 'pointer',
                      opacity: editingCourse && newCourseType !== 'online' ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Globe size={20} color="#4f46e5" />
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#312e81' }}>🔴 Online (Live Trực Tuyến)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Lớp học trực tuyến tương tác Live với gia sư theo khung giờ và thời gian biểu cố định.
                    </p>
                  </div>

                  <div
                    onClick={() => { if (!editingCourse) setNewCourseType('offline'); }}
                    style={{
                      border: newCourseType === 'offline' ? '2px solid #d97706' : '1px solid #cbd5e1',
                      background: newCourseType === 'offline' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.1))' : '#fff',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: editingCourse ? 'not-allowed' : 'pointer',
                      opacity: editingCourse && newCourseType !== 'offline' ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <PlayCircle size={20} color="#d97706" />
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#78350f' }}>📹 Offline (Video Bài Giảng)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Khóa học Video thu sẵn & Tài liệu tự học. Học sinh tự do học theo lộ trình mọi lúc mọi nơi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notice Banner based on course type */}
              {newCourseType === 'online' ? (
                <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1e40af' }}>
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <span><strong>Lớp Online Live:</strong> Cần thiết lập ngày Khai giảng / Bế giảng và lịch học tuần hoàn ngay bên dưới.</span>
                </div>
              ) : (
                <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#92400e' }}>
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <span><strong>Khóa Video Tự Học:</strong> Không cần ngày khai giảng. Sau khi tạo khóa, bạn bấm vào nút <strong>"Bài học"</strong> trên thẻ khóa học để đăng tải các Video bài giảng & Tài liệu.</span>
                </div>
              )}

              {/* Course Title & Subject */}
              <div className="form-group-db">
                <label>Tên khóa học *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lập trình ReactJS từ cơ bản đến nâng cao..."
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                />
              </div>

              <div className="form-row-db">
                <div className="form-group-db">
                  <label>Môn học / Chủ đề *</label>
                  <select value={newCourseSubject} onChange={(e) => setNewCourseSubject(e.target.value)}>
                    <option value="Lập trình & Web">Lập trình & Web</option>
                    <option value="Toán học">Toán học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Thiết kế & Đồ họa">Thiết kế & Đồ họa</option>
                    <option value="Âm nhạc & Nghệ thuật">Âm nhạc & Nghệ thuật</option>
                  </select>
                </div>

                <div className="form-group-db">
                  <label>Cấp độ học viên *</label>
                  <select value={newCourseLevel} onChange={(e) => setNewCourseLevel(e.target.value)}>
                    <option value="Beginner">Cơ bản (Beginner / Mất gốc)</option>
                    <option value="Intermediate">Trung cấp (Intermediate / Khá)</option>
                    <option value="Expert">Nâng cao (Expert / Luyện đề chuyên sâu)</option>
                  </select>
                </div>
              </div>

              {/* Conditional fields for ONLINE */}
              {newCourseType === 'online' && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="#4f46e5" />
                    <span>Thiết lập Lịch Học Live & Ngày Khai Giảng Tự Động</span>
                  </div>

                  {editingCourse && editingCourse.status === 'published' && (
                    <div style={{ padding: '8px 12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
                      ⚠️ Khóa học đã xuất bản nên không thể chỉnh sửa lịch dạy. Để thay đổi lịch, vui lòng xóa khóa này và tạo khóa học mới.
                    </div>
                  )}

                  <div className="form-row-db">
                    <div className="form-group-db">
                      <label>Ngày Khai Giảng (Bắt đầu) <span style={{color: 'red'}}>*</span></label>
                      <input
                        type="date"
                        value={newCourseStartDate}
                        required={newCourseType === 'online'}
                        disabled={editingCourse && editingCourse.status === 'published'}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                      />
                    </div>

                    <div className="form-group-db">
                      <label>Ngày Bế Giảng (Kết thúc) <span style={{color: 'red'}}>*</span></label>
                      <input
                        type="date"
                        value={newCourseEndDate}
                        required={newCourseType === 'online'}
                        disabled={editingCourse && editingCourse.status === 'published'}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Day of week pill selector */}
                  <div className="form-group-db" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                      Chọn các Thứ dạy trong tuần (Nhấp để chọn/bỏ chọn):
                    </label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {[
                        { label: 'Thứ 2', val: 1 },
                        { label: 'Thứ 3', val: 2 },
                        { label: 'Thứ 4', val: 3 },
                        { label: 'Thứ 5', val: 4 },
                        { label: 'Thứ 6', val: 5 },
                        { label: 'Thứ 7', val: 6 },
                        { label: 'Chủ Nhật', val: 0 }
                      ].map(day => {
                        const isSelected = newCourseScheduleDays.includes(day.val);
                        return (
                          <button
                            key={day.val}
                            type="button"
                            onClick={() => {
                              if (editingCourse && editingCourse.status === 'published') return;
                              if (isSelected) {
                                setNewCourseScheduleDays(newCourseScheduleDays.filter(d => d !== day.val));
                              } else {
                                setNewCourseScheduleDays([...newCourseScheduleDays, day.val]);
                              }
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: isSelected ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                              background: isSelected ? '#4f46e5' : '#fff',
                              color: isSelected ? '#fff' : '#475569',
                              fontWeight: 600,
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isSelected ? '✓ ' : ''}{day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Start & End time */}
                  <div className="form-row-db" style={{ marginTop: '4px' }}>
                    <div className="form-group-db">
                      <label style={{ fontSize: '12px' }}>Giờ bắt đầu học *</label>
                      <input
                        type="time"
                        value={newCourseStartTime}
                        disabled={editingCourse && editingCourse.status === 'published'}
                        onChange={(e) => setNewCourseStartTime(e.target.value)}
                      />
                    </div>

                    <div className="form-group-db">
                      <label style={{ fontSize: '12px' }}>Giờ kết thúc học *</label>
                      <input
                        type="time"
                        value={newCourseEndTime}
                        disabled={editingCourse && editingCourse.status === 'published'}
                        onChange={(e) => setNewCourseEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Schedule calculated preview banner */}
                  {newCourseStartDate && newCourseEndDate && newCourseScheduleDays.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#047857', background: '#ecfdf5', padding: '8px 12px', borderRadius: '6px', fontWeight: 500, border: '1px solid #a7f3d0' }}>
                      ✨ <strong>Tự động tạo lịch:</strong> Hệ thống sẽ sinh các buổi học live vào <strong>{newCourseStartTime} - {newCourseEndTime}</strong> ({newCourseScheduleDays.map(d => d === 0 ? 'Chủ Nhật' : `Thứ ${d + 1}`).join(', ')}) từ {newCourseStartDate} đến {newCourseEndDate}.
                    </div>
                  )}
                </div>
              )}

              {/* Price, Sessions, Duration & Capacity */}
              <div className="form-row-db">
                <div className="form-group-db">
                  <label>Học phí (VND/khóa) * (0 = Miễn phí)</label>
                  <input
                    type="number"
                    step="50000"
                    min={0}
                    required
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                  />
                </div>

                <div className="form-group-db">
                  <label>Số học viên tối đa / lớp</label>
                  <input
                    type="number"
                    min={1}
                    value={newCourseMaxStudents}
                    onChange={(e) => setNewCourseMaxStudents(Number(e.target.value))}
                    placeholder="1 = Lớp 1-1, >1 = Lớp nhóm"
                  />
                </div>
              </div>

              <div className="form-row-db">
                <div className="form-group-db">
                  <label>{newCourseType === 'online' ? 'Tổng số buổi học live' : 'Tổng số bài giảng video dự kiến'}</label>
                  <input
                    type="number"
                    min={1}
                    value={newCourseSessions}
                    readOnly={newCourseType === 'online'}
                    style={newCourseType === 'online' ? { backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' } : {}}
                    onChange={(e) => {
                      if (newCourseType !== 'online') {
                        setNewCourseSessions(Number(e.target.value));
                      }
                    }}
                  />
                  {newCourseType === 'online' && (
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      * Tự động tính toán dựa trên ngày và khung giờ học.
                    </div>
                  )}
                </div>

                {newCourseType !== 'online' && (
                  <div className="form-group-db">
                    <label>Thời lượng trung bình mỗi bài (phút)</label>
                    <input
                      type="number"
                      min={15}
                      value={newCourseDuration}
                      onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              {/* Detailed Description */}
              <div className="form-group-db">
                <label>Mô tả chi tiết & Lộ trình đào tạo</label>
                <textarea
                  rows={3}
                  placeholder="Giới thiệu về mục tiêu khóa học, các kỹ năng đạt được, kiến thức cần chuẩn bị..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                />
              </div>

              {/* Thumbnail URL & Quick Sample Presets */}
              <div className="form-group-db">
                <label>Đường dẫn Ảnh đại diện (Thumbnail URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newCourseThumbnail}
                  onChange={(e) => setNewCourseThumbnail(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Gợi ý mẫu ảnh đẹp:</span>
                  <button
                    type="button"
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                    onClick={() => setNewCourseThumbnail('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60')}
                  >
                    💻 Lập trình
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                    onClick={() => setNewCourseThumbnail('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=60')}
                  >
                    📐 Toán học
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                    onClick={() => setNewCourseThumbnail('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60')}
                  >
                    🇬🇧 Tiếng Anh
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                    onClick={() => setNewCourseThumbnail('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60')}
                  >
                    🎨 Thiết kế
                  </button>
                </div>
              </div>

              {/* Status choice */}
              <div className="form-group-db">
                <label>Trạng thái xuất bản khóa học</label>
                <select value={newCourseStatus} onChange={(e) => setNewCourseStatus(e.target.value as any)}>
                  <option value="published">🟢 Đang tuyển sinh (Hiển thị ngay cho học viên)</option>
                  <option value="draft">⚪ Bản nháp (Lưu tạm, chưa cho học viên thấy)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-db" onClick={() => setIsCourseModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">
                  {editingCourse ? 'Cập nhật khóa học' : 'Tạo khóa học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* MODAL 3: WITHDRAW MONEY */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Rút tiền về ngân hàng</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="form-group-db">
                <label>Số dư khả dụng</label>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#4f46e5', marginTop: '4px' }}>
                  {formatVND(walletBalance)}
                </div>
              </div>

              <div className="form-group-db">
                <label>Số tiền muốn rút (VND) *</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                />
              </div>

              <div className="form-group-db">
                <label>Ngân hàng nhận *</label>
                <select value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)}>
                  <option value="Techcombank">Techcombank</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="MBBank">MBBank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="ACB">ACB</option>
                  <option value="VPBank">VPBank</option>
                </select>
              </div>

              <div className="form-group-db">
                <label>Số tài khoản ngân hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập số tài khoản..."
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-db" onClick={() => setIsWithdrawModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">Gửi yêu cầu rút tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD CERTIFICATE */}
      {isCertModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Thêm chứng chỉ / bằng cấp mới</h3>
              <button onClick={() => setIsCertModalOpen(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCertSubmit}>
              <div className="form-group-db">
                <label>Tên chứng chỉ / bằng cấp *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bằng Cử nhân Sư phạm Toán, IELTS 8.0..."
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
              </div>

              <div className="form-group-db">
                <label>Tải tệp từ máy tính (PDF, PNG, JPG) *</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setSelectedCertFile(file);
                  }}
                />
                {selectedCertFile ? (
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>
                    ✓ Đã chọn: {selectedCertFile.name} ({(selectedCertFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                    Chọn tệp minh chứng từ máy tính của bạn để tải lên Supabase Storage tự động.
                  </span>
                )}
              </div>

              <div className="form-group-db">
                <label>Hoặc nhập URL tệp trực tiếp (nếu có)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={certFileUrl}
                  onChange={(e) => setCertFileUrl(e.target.value)}
                />
              </div>

              <div className="form-row-db">
                <div className="form-group-db">
                  <label>Định dạng tệp</label>
                  <select value={certFileType} onChange={(e) => setCertFileType(e.target.value)}>
                    <option value="PDF">Tệp PDF</option>
                    <option value="PNG">Hình ảnh PNG</option>
                    <option value="JPG">Hình ảnh JPG</option>
                  </select>
                </div>

                <div className="form-group-db">
                  <label>Nơi cấp (Trường / Tổ chức)</label>
                  <input
                    type="text"
                    placeholder="VD: ĐH Sư phạm Hà Nội, British Council..."
                    value={certIssuedBy}
                    onChange={(e) => setCertIssuedBy(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-db">
                <div className="form-group-db">
                  <label>Ngày cấp</label>
                  <input
                    type="date"
                    value={certIssuedDate}
                    onChange={(e) => setCertIssuedDate(e.target.value)}
                  />
                </div>

                <div className="form-group-db">
                  <label>Ngày hết hạn (nếu có)</label>
                  <input
                    type="date"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-db" onClick={() => setIsCertModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">Gửi chứng chỉ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LESSON MANAGEMENT (OFFLINE) */}
      <LessonManagementModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          cancelEditLesson();
          setIsLessonModalOpen(false);
        }}
        selectedCourse={selectedCourseForLessons}
        lessons={courseLessons}
        newLessonTitle={newLessonTitle}
        setNewLessonTitle={setNewLessonTitle}
        newLessonUrl={newLessonUrl}
        setNewLessonUrl={setNewLessonUrl}
        newLessonDesc={newLessonDesc}
        setNewLessonDesc={setNewLessonDesc}
        editingLesson={editingLesson}
        onEditLesson={handleEditLesson}
        onCancelEdit={cancelEditLesson}
        handleAddLessonSubmit={handleAddLessonSubmit}
        handleDeleteLesson={handleDeleteLesson}
      />

      {/* MODAL 6: DOCUMENT MANAGEMENT (ONLINE) */}
      <DocumentManagementModal
        isOpen={isDocumentModalOpen}
        onClose={() => {
          cancelEditDocument();
          setIsDocumentModalOpen(false);
        }}
        selectedCourse={selectedCourseForLessons}
        documents={courseDocuments}
        newDocTitle={newDocTitle}
        setNewDocTitle={setNewDocTitle}
        newDocUrl={newDocUrl}
        setNewDocUrl={setNewDocUrl}
        newDocType={newDocType}
        setNewDocType={setNewDocType}
        newDocDesc={newDocDesc}
        setNewDocDesc={setNewDocDesc}
        editingDocument={editingDocument}
        onEditDocument={handleEditDocument}
        onCancelEdit={cancelEditDocument}
        handleAddDocumentSubmit={handleAddDocumentSubmit}
        handleDeleteDocument={handleDeleteDocument}
      />

    </div>
  );
};

export default TeacherDashboard;
