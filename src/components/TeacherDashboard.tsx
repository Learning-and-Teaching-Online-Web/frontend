import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  Star,
  CreditCard,
  Plus,
  X,
  DollarSign,
  Users,
  Award,
  Globe,
  PlayCircle,
  Sparkles,
  Info
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
import { VerificationBanner } from './teacher/VerificationBanner';
import { LessonManagementModal } from './teacher/LessonManagementModal';

const TeacherDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    teacherName,
    stats,
    tutorProfile,
    courses,
    bookings,
    reviews,
    transactions,
    walletBalance,
    articles,
    allSchedules,
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
    isScheduleModalOpen, setIsScheduleModalOpen, openAddScheduleModal,
    isWithdrawModalOpen, setIsWithdrawModalOpen,
    isArticleModalOpen, setIsArticleModalOpen,
    editingArticle,
    // Course Form
    newCourseTitle, setNewCourseTitle,
    newCourseSubject, setNewCourseSubject,
    newCoursePrice, setNewCoursePrice,
    newCourseType, setNewCourseType,
    newCourseStartDate, setNewCourseStartDate,
    newCourseEndDate, setNewCourseEndDate,
    newCourseDurationMonths, setNewCourseDurationMonths,
    newCourseLevel, setNewCourseLevel,
    newCourseSessions, setNewCourseSessions,
    newCourseDuration, setNewCourseDuration,
    newCourseDescription, setNewCourseDescription,
    newCourseThumbnail, setNewCourseThumbnail,
    newCourseMaxStudents, setNewCourseMaxStudents,
    newCourseStatus, setNewCourseStatus,

    // Schedule Form
    scheduleCourseId, setScheduleCourseId,
    scheduleDate, setScheduleDate,
    scheduleStart, setScheduleStart,
    scheduleEnd, setScheduleEnd,
    handleAddScheduleSubmit,
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
    handleCancelBooking
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

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* SIDEBAR NAVIGATION */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-avatar" style={{ overflow: 'hidden', padding: 0 }}>
              {tutorProfile?.user?.avatar_url ? (
                <img
                  src={tutorProfile.user.avatar_url}
                  alt={teacherName}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                teacherName.charAt(0).toUpperCase()
              )}
            </div>
            <h3 className="sidebar-name">{teacherName}</h3>
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
              handleDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'schedules' && (
            <SchedulesTab
              allSchedules={allSchedules}
              formatDateString={formatDateString}
              openAddScheduleModal={openAddScheduleModal}
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
            />
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
                    onClick={() => setNewCourseType('online')}
                    style={{
                      border: newCourseType === 'online' ? '2px solid #6366f1' : '1px solid #cbd5e1',
                      background: newCourseType === 'online' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(79, 70, 229, 0.1))' : '#fff',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
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
                    onClick={() => setNewCourseType('offline')}
                    style={{
                      border: newCourseType === 'offline' ? '2px solid #d97706' : '1px solid #cbd5e1',
                      background: newCourseType === 'offline' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.1))' : '#fff',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
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
                  <span><strong>Lớp Online Live:</strong> Cần thiết lập ngày Khai giảng / Bế giảng. Bạn có thể tạo các khung giờ dạy live ở mục <em>Lịch dạy của tôi</em>.</span>
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
                <div className="form-row-db">
                  <div className="form-group-db">
                    <label>Ngày Khai Giảng (Bắt đầu)</label>
                    <input
                      type="date"
                      value={newCourseStartDate}
                      onChange={(e) => setNewCourseStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group-db">
                    <label>Ngày Bế Giảng (Kết thúc)</label>
                    <input
                      type="date"
                      value={newCourseEndDate}
                      onChange={(e) => setNewCourseEndDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group-db">
                    <label>Thời gian đào tạo (Số tháng)</label>
                    <input
                      type="number"
                      min={1}
                      value={newCourseDurationMonths}
                      onChange={(e) => setNewCourseDurationMonths(Number(e.target.value))}
                    />
                  </div>
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
                    onChange={(e) => setNewCourseSessions(Number(e.target.value))}
                  />
                </div>

                <div className="form-group-db">
                  <label>{newCourseType === 'online' ? 'Thời lượng mỗi buổi (phút)' : 'Thời lượng trung bình mỗi bài (phút)'}</label>
                  <input
                    type="number"
                    min={15}
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                  />
                </div>
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

      {/* MODAL 2: ADD SCHEDULE */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Thêm khung giờ dạy rảnh</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddScheduleSubmit}>
              <div className="form-group-db">
                <label>Chọn khóa học áp dụng *</label>
                <select value={scheduleCourseId} onChange={(e) => setScheduleCourseId(e.target.value)}>
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-db">
                <label>Ngày dạy *</label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <div className="form-row-db">
                <div className="form-group-db">
                  <label>Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                  />
                </div>

                <div className="form-group-db">
                  <label>Giờ kết thúc *</label>
                  <input
                    type="time"
                    required
                    value={scheduleEnd}
                    onChange={(e) => setScheduleEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-db" onClick={() => setIsScheduleModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db"><Plus size={16} /> Thêm khung giờ</button>
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

      {/* MODAL 5: LESSON MANAGEMENT */}
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

    </div>
  );
};

export default TeacherDashboard;
