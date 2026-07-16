import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Star, 
  CreditCard, 
  Plus, 
  X, 
  DollarSign, 
  Users, 
  ChevronRight
} from 'lucide-react';
import { tutorApi } from '../api/tutorApi';
import '../styles/TeacherDashboard.css';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  activeSchedules: number;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'schedules' | 'bookings' | 'reviews' | 'wallet'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // App States representing Database values
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeSchedules: 0
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  // Localized user details
  const [teacherName, setTeacherName] = useState('Gia sư NovaLearn');
  
  // Helper to load all dashboard data from API
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await tutorApi.getStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      
      // 2. Fetch Courses
      const coursesRes = await tutorApi.getMyCourses();
      if (coursesRes.success) {
        setCourses(coursesRes.data || []);
      }
      
      // 3. Fetch Bookings
      const bookingsRes = await tutorApi.getBookings();
      if (bookingsRes.success) {
        setBookings(bookingsRes.data || []);
      }

      // 4. Fetch Reviews
      const reviewsRes = await tutorApi.getReviews();
      if (reviewsRes.success) {
        setReviews(reviewsRes.data || []);
      }

      // 5. Fetch Wallet Balance & Transactions
      const walletRes = await tutorApi.getWallet();
      if (walletRes.success) {
        setWalletBalance(walletRes.data.balance);
        setTransactions(walletRes.data.transactions || []);
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error(error.response?.data?.error || 'Không thể đồng bộ dữ liệu từ cơ sở dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    if (auth !== 'true') {
      toast.warning('Vui lòng đăng nhập để truy cập kênh gia sư.');
      navigate('/auth');
      return;
    }
    
    if (role !== 'tutor') {
      toast.error('Tài khoản của bạn không có quyền truy cập kênh gia sư.');
      navigate('/');
      return;
    }
    
    if (name) {
      setTeacherName(name);
    }

    loadDashboardData();
  }, [navigate]);

  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Form States - Course
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubject, setNewCourseSubject] = useState('Lập trình & Web');
  const [newCoursePrice, setNewCoursePrice] = useState(300000);
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner');
  const [newCourseSessions, setNewCourseSessions] = useState(10);
  const [newCourseDuration, setNewCourseDuration] = useState(90);

  // Form States - Schedule
  const [scheduleCourseId, setScheduleCourseId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-07-20');
  const [scheduleStart, setScheduleStart] = useState('09:00');
  const [scheduleEnd, setScheduleEnd] = useState('10:30');

  // Form States - Withdrawal
  const [withdrawAmount, setWithdrawAmount] = useState(500000);
  const [withdrawBank, setWithdrawBank] = useState('Techcombank');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  // Auto-fill course ID for schedule when courses load
  useEffect(() => {
    if (courses.length > 0 && !scheduleCourseId) {
      setScheduleCourseId(courses[0].course_id);
    }
  }, [courses, scheduleCourseId]);

  // ----------------------------------------------------
  // EVENT HANDLERS (API Calls)
  // ----------------------------------------------------
  
  // Format Currency Helper
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Format date helper
  const formatDateString = (isoString: string) => {
    if (!isoString) return 'Chưa xác định';
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} lúc ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // 1. Confirm Booking Request
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await tutorApi.updateBookingStatus(bookingId, 'confirmed');
      toast.success('Phê duyệt yêu cầu đăng ký học thành công!');
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể phê duyệt booking này.');
    }
  };

  // 2. Reject Booking Request
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await tutorApi.updateBookingStatus(bookingId, 'cancelled');
      toast.info('Đã từ chối/hủy yêu cầu đăng ký.');
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể từ chối booking này.');
    }
  };

  // 3. Create Course
  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      toast.error('Vui lòng nhập tên khóa học');
      return;
    }

    try {
      await tutorApi.createCourse({
        title: newCourseTitle,
        subject: newCourseSubject,
        price: Number(newCoursePrice),
        level: newCourseLevel,
        duration_minutes: Number(newCourseDuration),
        total_sessions: Number(newCourseSessions)
      });

      toast.success('Tạo khóa học mới thành công!');
      setIsCourseModalOpen(false);
      setNewCourseTitle('');
      setNewCoursePrice(300000);
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Tạo khóa học mới thất bại.');
    }
  };

  // 4. Add Schedule Slot
  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleCourseId) {
      toast.error('Vui lòng chọn khóa học');
      return;
    }

    const startISO = `${scheduleDate}T${scheduleStart}:00+07:00`;
    const endISO = `${scheduleDate}T${scheduleEnd}:00+07:00`;

    try {
      await tutorApi.addSchedule(scheduleCourseId, {
        start_time: startISO,
        end_time: endISO,
        is_recurring: false,
        max_slot: 1
      });

      toast.success('Đã thêm khung giờ dạy mới vào cơ sở dữ liệu!');
      setIsScheduleModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Không thể thêm khung giờ dạy.');
    }
  };

  // 5. Withdrawal Money Request
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      toast.error('Số tiền rút phải lớn hơn 0');
      return;
    }
    if (withdrawAmount > walletBalance) {
      toast.error('Số dư ví không đủ để rút số tiền này.');
      return;
    }
    if (!withdrawAccount.trim()) {
      toast.error('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }

    try {
      await tutorApi.requestWithdrawal({
        amount: Number(withdrawAmount),
        bankName: withdrawBank,
        bankAccount: withdrawAccount
      });

      toast.success('Đã gửi yêu cầu rút tiền lên hệ thống!');
      setIsWithdrawModalOpen(false);
      setWithdrawAccount('');
      loadDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Rút tiền thất bại.');
    }
  };

  // Extract all schedules consolidated for display in the Calendar/Schedule Tab
  const allSchedules = courses.reduce((acc: any[], course) => {
    const courseSchedules = (course.schedules || []).map((sch: any) => ({
      ...sch,
      course_title: course.title,
      course_id: course.course_id
    }));
    return [...acc, ...courseSchedules];
  }, []);

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
        
        {/* ============================================================
           1. SIDEBAR NAVIGATION
           ============================================================ */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {teacherName.charAt(0).toUpperCase()}
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
                className={`menu-item-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={18} />
                Nhận xét học sinh
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

        {/* ============================================================
           2. MAIN DASHBOARD PANELS
           ============================================================ */}
        <main className="dashboard-main">
          
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

          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="overview-layout">
              {/* Recent Bookings Section */}
              <div className="section-card">
                <div className="section-header">
                  <h2>Yêu cầu đăng ký học mới nhất</h2>
                  <button className="btn-secondary-db" onClick={() => setActiveTab('bookings')}>
                    Xem tất cả <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="table-responsive">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Học sinh</th>
                        <th>Khóa học</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'pending').slice(0, 3).map(b => {
                        const studentName = b.student?.user?.full_name || b.student_name || 'Học sinh';
                        const studentEmail = b.student?.user?.email || b.student_email || '';
                        const studentAvatar = b.student?.user?.avatar_url || b.student_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60';
                        const courseTitle = b.course?.title || b.course_title || 'Khóa học';
                        const startTime = b.schedule?.start_time || b.start_time;

                        return (
                          <tr key={b.booking_id}>
                            <td>
                              <div className="user-cell">
                                <img src={studentAvatar} alt={studentName} />
                                <div>
                                  <span className="user-name">{studentName}</span>
                                  <span className="user-sub">{studentEmail}</span>
                                </div>
                              </div>
                            </td>
                            <td>{courseTitle}</td>
                            <td>{formatDateString(startTime)}</td>
                            <td><span className="badge badge-pending">Đang chờ</span></td>
                            <td>
                              <div className="actions-group">
                                <button 
                                  className="btn-action-success"
                                  onClick={() => handleConfirmBooking(b.booking_id)}
                                >
                                  Phê duyệt
                                </button>
                                <button 
                                  className="btn-action-danger"
                                  onClick={() => handleCancelBooking(b.booking_id)}
                                >
                                  Hủy
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {bookings.filter(b => b.status === 'pending').length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                            Không có yêu cầu đăng ký học mới nào cần phê duyệt.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wallet/Earnings Summary */}
              <div className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="section-header">
                    <h2>Ví gia sư</h2>
                  </div>
                  <div className="wallet-card" style={{ padding: '20px', borderRadius: '15px' }}>
                    <div className="wallet-details">
                      <span className="wallet-label">Số dư khả dụng</span>
                      <span className="wallet-balance" style={{ fontSize: '24px' }}>{formatVND(walletBalance)}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn-primary-db" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsWithdrawModalOpen(true)}>
                    <DollarSign size={16} /> Rút tiền về ngân hàng
                  </button>
                  <button className="btn-secondary-db" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('wallet')}>
                    Xem lịch sử giao dịch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE MANAGEMENT PANEL */}
          {activeTab === 'courses' && (
            <div className="section-card">
              <div className="section-header">
                <h2>Khóa học của tôi</h2>
                <button className="btn-primary-db" onClick={() => setIsCourseModalOpen(true)}>
                  <Plus size={16} /> Tạo khóa học mới
                </button>
              </div>

              <div className="course-db-grid">
                {courses.map(course => (
                  <div className="course-db-card" key={course.course_id}>
                    <div className="course-db-thumb">
                      <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'} alt={course.title} />
                      <div className="course-db-badge">
                        <span className={`badge badge-${course.status}`}>
                          {course.status === 'published' ? 'Đang tuyển sinh' : course.status === 'draft' ? 'Bản nháp' : 'Đã ẩn'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="course-db-body">
                      <span className="course-db-subject">{course.subject}</span>
                      <h3 className="course-db-title" title={course.title}>{course.title}</h3>
                      <div className="course-db-price">{formatVND(Number(course.price))}</div>
                      
                      <div className="course-db-meta">
                        <span>Lớp: {course.level || 'Cơ bản'}</span>
                        <span>{course.studentsCount || 0} học viên</span>
                        <span>{(course.schedules || []).length} lịch dạy</span>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                    Bạn chưa tạo khóa học nào. Hãy nhấp vào "Tạo khóa học mới" để bắt đầu soạn bài giảng.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE MANAGEMENT PANEL */}
          {activeTab === 'schedules' && (
            <div className="section-card">
              <div className="section-header">
                <h2>Quản lý lịch dạy của gia sư</h2>
                <button className="btn-primary-db" onClick={() => setIsScheduleModalOpen(true)}>
                  <Plus size={16} /> Thêm khung giờ dạy
                </button>
              </div>

              <div className="table-responsive">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th>Bắt đầu</th>
                      <th>Kết thúc</th>
                      <th>Trạng thái</th>
                      <th>Học sinh đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSchedules.map((sch: any) => (
                      <tr key={sch.schedule_id}>
                        <td style={{ fontWeight: 600 }}>{sch.course_title}</td>
                        <td>{formatDateString(sch.start_time)}</td>
                        <td>{formatDateString(sch.end_time)}</td>
                        <td>
                          <span className={`badge ${sch.is_booked ? 'badge-confirmed' : 'badge-draft'}`}>
                            {sch.is_booked ? 'Đã được đặt' : 'Đang trống'}
                          </span>
                        </td>
                        <td>
                          {sch.is_booked ? (
                            <div className="user-cell">
                              <span style={{ fontWeight: 500 }}>{sch.student_name || 'Học sinh'}</span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Chưa có</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {allSchedules.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                          Chưa cấu hình lịch dạy nào. Bấm vào nút "Thêm khung giờ dạy" để tạo khung giờ rảnh.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKING MANAGEMENT PANEL */}
          {activeTab === 'bookings' && (
            <div className="section-card">
              <div className="section-header">
                <h2>Tất cả yêu cầu đăng ký học lớp</h2>
              </div>

              <div className="table-responsive">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Học sinh</th>
                      <th>Khóa học</th>
                      <th>Thời gian lớp</th>
                      <th>Số tiền thanh toán</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const studentName = b.student?.user?.full_name || b.student_name || 'Học sinh';
                      const studentEmail = b.student?.user?.email || b.student_email || '';
                      const studentAvatar = b.student?.user?.avatar_url || b.student_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60';
                      const courseTitle = b.course?.title || b.course_title || 'Khóa học';
                      const startTime = b.schedule?.start_time || b.start_time;

                      return (
                        <tr key={b.booking_id}>
                          <td>
                            <div className="user-cell">
                              <img src={studentAvatar} alt={studentName} />
                              <div>
                                <span className="user-name">{studentName}</span>
                                <span className="user-sub">{studentEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td>{courseTitle}</td>
                          <td>{formatDateString(startTime)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formatVND(Number(b.total_amount))}</td>
                          <td>
                            <span className={`badge badge-${b.status}`}>
                              {b.status === 'pending' && 'Đang chờ duyệt'}
                              {b.status === 'confirmed' && 'Đã duyệt'}
                              {b.status === 'completed' && 'Hoàn thành'}
                              {b.status === 'cancelled' && 'Đã hủy'}
                            </span>
                          </td>
                          <td>
                            {b.status === 'pending' && (
                              <div className="actions-group">
                                <button 
                                  className="btn-action-success"
                                  onClick={() => handleConfirmBooking(b.booking_id)}
                                >
                                  Duyệt học
                                </button>
                                <button 
                                  className="btn-action-danger"
                                  onClick={() => handleCancelBooking(b.booking_id)}
                                >
                                  Từ chối
                                </button>
                              </div>
                            )}
                            {b.status === 'confirmed' && (
                              <button 
                                className="btn-action-danger"
                                onClick={() => handleCancelBooking(b.booking_id)}
                              >
                                Hủy buổi học
                              </button>
                            )}
                            {b.status !== 'pending' && b.status !== 'confirmed' && (
                              <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '13px' }}>Không có</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                          Chưa có yêu cầu đặt lớp nào từ học sinh.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS PANEL */}
          {activeTab === 'reviews' && (
            <div className="section-card">
              <div className="section-header">
                <h2>Đánh giá từ người học</h2>
              </div>

              <div className="reviews-list">
                {reviews.map(rev => {
                  const studentName = rev.student?.user?.full_name || rev.student_name || 'Học sinh';
                  const studentAvatar = rev.student?.user?.avatar_url || rev.student_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60';
                  const courseTitle = rev.booking?.course?.title || rev.course_title || 'Khóa học';

                  return (
                    <div className="review-item" key={rev.review_id}>
                      <div className="review-header">
                        <div className="review-student">
                          <img src={studentAvatar} alt={studentName} />
                          <div>
                            <span className="user-name">{studentName}</span>
                            <span className="review-course">Đăng ký lớp: {courseTitle}</span>
                          </div>
                        </div>
                        <div className="review-rating">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx} style={{ color: idx < Math.floor(rev.rating) ? '#fbbf24' : '#cbd5e1' }}>★</span>
                          ))}
                          <span style={{ marginLeft: '8px', color: 'var(--text-dark)', fontWeight: 600 }}>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="review-comment">"{rev.comment || 'Không có bình luận'}"</p>
                    </div>
                  );
                })}
                {reviews.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                    Chưa nhận được nhận xét đánh giá nào từ học sinh.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: WALLET & REVENUE PANEL */}
          {activeTab === 'wallet' && (
            <div>
              <div className="section-card" style={{ marginBottom: '25px' }}>
                <div className="wallet-card">
                  <div className="wallet-details">
                    <span className="wallet-label">Số dư ví khả dụng (VND)</span>
                    <span className="wallet-balance">{formatVND(walletBalance)}</span>
                  </div>
                  <button className="btn-primary-db" style={{ background: 'white', color: '#1e1b4b', boxShadow: 'none' }} onClick={() => setIsWithdrawModalOpen(true)}>
                    Yêu cầu rút tiền
                  </button>
                </div>
              </div>

              <div className="section-card">
                <div className="section-header">
                  <h2>Lịch sử biến động số dư tài khoản</h2>
                </div>

                <div className="table-responsive">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Mã giao dịch</th>
                        <th>Loại giao dịch</th>
                        <th>Số tiền</th>
                        <th>Nội dung chi tiết</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx: any) => (
                        <tr key={tx.transaction_id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.transaction_id.slice(0, 10)}</td>
                          <td>
                            <span style={{ 
                              color: tx.type === 'earning' ? '#059669' : '#dc2626',
                              fontWeight: 600 
                            }}>
                              {tx.type === 'earning' ? 'Học phí lớp' : 'Rút tiền'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {tx.type === 'earning' ? '+' : '-'}{formatVND(tx.amount)}
                          </td>
                          <td>{tx.description}</td>
                          <td>{formatDateString(tx.created_at)}</td>
                          <td>
                            <span className={`badge ${
                              tx.status === 'success' ? 'badge-completed' : tx.status === 'pending' ? 'badge-pending' : 'badge-cancelled'
                            }`}>
                              {tx.status === 'success' && 'Thành công'}
                              {tx.status === 'pending' && 'Đang xử lý'}
                              {tx.status === 'failed' && 'Thất bại'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                            Chưa có giao dịch biến động số dư nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================
         3. MODALS FOR ACTION POPUPS (COURSE, SCHEDULE, WITHDRAWAL)
         ============================================================ */}
      
      {/* A. Create Course Modal */}
      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Tạo khóa học mới (Gia sư thiết lập)</h3>
              <button className="modal-close" onClick={() => setIsCourseModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCourseSubmit}>
              <div className="modal-body db-form">
                <div className="form-group">
                  <label>Tên khóa học</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Lập trình di động Flutter từ cơ bản..." 
                    value={newCourseTitle} 
                    onChange={e => setNewCourseTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Chủ đề môn học</label>
                    <select value={newCourseSubject} onChange={e => setNewCourseSubject(e.target.value)}>
                      <option value="Lập trình & Web">Lập trình & Web</option>
                      <option value="Thiết kế UI/UX">Thiết kế UI/UX</option>
                      <option value="Tiếng Anh giao tiếp">Tiếng Anh giao tiếp</option>
                      <option value="Toán học phổ thông">Toán học phổ thông</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Học phí mỗi buổi (VND)</label>
                    <input 
                      type="number" 
                      value={newCoursePrice} 
                      onChange={e => setNewCoursePrice(Number(e.target.value))} 
                      min={0}
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Trình độ lớp</label>
                    <select value={newCourseLevel} onChange={e => setNewCourseLevel(e.target.value)}>
                      <option value="Beginner">Cơ bản (Beginner)</option>
                      <option value="Intermediate">Trung cấp (Intermediate)</option>
                      <option value="Expert">Nâng cao (Expert)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Thời lượng buổi (Phút)</label>
                    <select value={newCourseDuration} onChange={e => setNewCourseDuration(Number(e.target.value))}>
                      <option value={45}>45 phút</option>
                      <option value={60}>60 phút</option>
                      <option value={90}>90 phút</option>
                      <option value={120}>120 phút</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tổng số buổi học</label>
                  <input 
                    type="number" 
                    value={newCourseSessions} 
                    onChange={e => setNewCourseSessions(Number(e.target.value))}
                    min={1} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-db" onClick={() => setIsCourseModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">Tạo khóa học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. Add Schedule Slot Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm khung giờ dạy mới</h3>
              <button className="modal-close" onClick={() => setIsScheduleModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddScheduleSubmit}>
              <div className="modal-body db-form">
                <div className="form-group">
                  <label>Chọn khóa học áp dụng lịch dạy</label>
                  <select value={scheduleCourseId} onChange={e => setScheduleCourseId(e.target.value)}>
                    {courses.map(course => (
                      <option key={course.course_id} value={course.course_id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày học</label>
                  <input 
                    type="date" 
                    value={scheduleDate} 
                    onChange={e => setScheduleDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Giờ bắt đầu</label>
                    <input 
                      type="time" 
                      value={scheduleStart} 
                      onChange={e => setScheduleStart(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Giờ kết thúc</label>
                    <input 
                      type="time" 
                      value={scheduleEnd} 
                      onChange={e => setScheduleEnd(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-db" onClick={() => setIsScheduleModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">Thêm vào lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Request Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Yêu cầu rút tiền về ngân hàng</h3>
              <button className="modal-close" onClick={() => setIsWithdrawModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="modal-body db-form">
                <div className="form-group">
                  <label>Số tiền rút (VND)</label>
                  <input 
                    type="number" 
                    value={withdrawAmount} 
                    onChange={e => setWithdrawAmount(Number(e.target.value))} 
                    max={walletBalance}
                    min={50000}
                    step={10000}
                    required 
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '11px' }}>Số dư ví khả dụng: {formatVND(walletBalance)}</small>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên ngân hàng</label>
                    <select value={withdrawBank} onChange={e => setWithdrawBank(e.target.value)}>
                      <option value="Techcombank">Techcombank</option>
                      <option value="Vietcombank">Vietcombank</option>
                      <option value="MB Bank">MB Bank</option>
                      <option value="BIDV">BIDV</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số tài khoản thụ hưởng</label>
                    <input 
                      type="text" 
                      placeholder="Nhập số tài khoản..." 
                      value={withdrawAccount} 
                      onChange={e => setWithdrawAccount(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary-db" onClick={() => setIsWithdrawModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary-db">Gửi yêu cầu rút</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
