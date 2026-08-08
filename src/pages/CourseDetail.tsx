import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, BookOpen, HelpCircle, Star, Award, LogIn, Trash2, AlertCircle, CheckCircle2, Video, FileText, ExternalLink, PlayCircle, X, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { courseApi, mapBackendCourseToFrontend } from '../services/courseApi';
import { bookingApi } from '../services/bookingApi';
import { favoriteApi } from '../services/favoriteApi';
import authStorage from '../utils/authStorage';
import '../styles/CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs' | 'reviews'>('overview');
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLessonModal, setSelectedLessonModal] = useState<any | null>(null);
  const [isFavoriteTutor, setIsFavoriteTutor] = useState<boolean>(false);
  const [myBooking, setMyBooking] = useState<any | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  // Auth states
  const isAuthenticated = authStorage.isAuthenticated();
  const userName = authStorage.getUserName() || '';

  // Course Comments states
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Enrollment check states
  const [enrollmentStatus, setEnrollmentStatus] = useState<{
    canComment: boolean;
    reason: string;
  } | null>(null);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState<boolean>(false);

  const fetchCourseComments = async (cId: string) => {
    try {
      setIsLoadingComments(true);
      const res = await courseApi.getComments(cId);
      if (res && res.success && Array.isArray(res.data)) {
        setCommentsList(res.data);
      }
    } catch (err) {
      console.error('Error fetching course comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Check if current student can comment (has purchased the course and meets status requirements)
  const checkEnrollmentStatus = async (courseType: string) => {
    if (!isAuthenticated) return;
    const userRole = authStorage.getUserRole();
    if (userRole === 'admin' || userRole === 'tutor') {
      // Admins & tutors can always comment (bypass check)
      setEnrollmentStatus({ canComment: true, reason: '' });
      return;
    }
    try {
      setIsCheckingEnrollment(true);
      const bookingsRes = await bookingApi.getMyBookings();
      if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
        const booking = bookingsRes.data.find((b: any) => b.course?.course_id === courseId);
        setMyBooking(booking || null);
        if (!booking) {
          setEnrollmentStatus({
            canComment: false,
            reason: 'Bạn chưa mua khóa học này nên chưa thể gửi bình luận & đánh giá.'
          });
          return;
        }
        const isPaid = booking.payment_status === 'paid' || booking.status === 'confirmed' || booking.status === 'completed';
        if (courseType === 'online') {
          if (booking.status === 'completed') {
            setEnrollmentStatus({ canComment: true, reason: '' });
          } else {
            setEnrollmentStatus({
              canComment: false,
              reason: 'Khóa học Online cần kết thúc toàn bộ (trạng thái Hoàn thành) mới có thể bình luận & đánh giá.'
            });
          }
        } else {
          // offline
          if (isPaid) {
            setEnrollmentStatus({ canComment: true, reason: '' });
          } else {
            setEnrollmentStatus({
              canComment: false,
              reason: 'Bạn cần mua/thanh toán khóa học Offline thành công mới có thể bình luận & đánh giá.'
            });
          }
        }
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        const res = await courseApi.getDetail(courseId);
        if (res && res.success && res.data) {
          const mapped = mapBackendCourseToFrontend(res.data);
          setCourse(mapped);

          if (mapped.tutor_id && isAuthenticated && authStorage.getUserRole() !== 'tutor' && authStorage.getUserRole() !== 'admin') {
            try {
              const favRes = await favoriteApi.getMyFavorites();
              if (favRes && favRes.success && Array.isArray(favRes.data)) {
                const isFav = favRes.data.some((f: any) => f.tutor?.tutor_id === mapped.tutor_id);
                setIsFavoriteTutor(isFav);
              }
            } catch (favErr) {
              console.error('Error fetching favorites:', favErr);
            }
          }

          // Check enrollment status after course is loaded
          if (isAuthenticated) {
            await checkEnrollmentStatus(res.data.type || 'online');
          }
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error('Error fetching course detail:', err);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetail();
    if (courseId) {
      fetchCourseComments(courseId);
    }
  }, [courseId, isAuthenticated]);

  const handleToggleFavoriteTutor = async () => {
    if (!isAuthenticated) {
      toast.warning('Bạn cần đăng nhập tài khoản Học viên để yêu thích giảng viên.');
      return;
    }
    const currentRole = authStorage.getUserRole();
    if (currentRole === 'tutor' || currentRole === 'admin') {
      toast.error('Chỉ tài khoản Học viên mới có quyền yêu thích giảng viên.');
      return;
    }
    if (!course || !course.tutor_id) return;

    try {
      const res = await favoriteApi.toggleFavorite(course.tutor_id);
      if (res && res.success) {
        setIsFavoriteTutor(!isFavoriteTutor);
        if (!isFavoriteTutor) {
          toast.success(`Đã thêm ${course.instructor} vào danh sách giảng viên yêu thích! ❤️`);
        } else {
          toast.info(`Đã xóa ${course.instructor} khỏi danh sách yêu thích.`);
        }
      } else {
        toast.error(res?.error || 'Không thể thay đổi trạng thái yêu thích.');
      }
    } catch (err: any) {
      console.error('Error toggling favorite tutor:', err);
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu giảng viên yêu thích.');
    }
  };

  const handleStartNow = async () => {
    if (!isAuthenticated) {
      toast.warning('Bạn cần đăng nhập để đăng ký khóa học. Đang chuyển hướng...');
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    const userRole = authStorage.getUserRole();
    if (userRole === 'admin') {
      toast.error('Tài khoản Quản trị viên (Admin) không thể đăng ký khóa học.');
      return;
    }
    if (userRole === 'tutor') {
      toast.error('Tài khoản Giảng viên không thể đăng ký khóa học. Vui lòng sử dụng tài khoản Học viên.');
      return;
    }

    if (!courseId || !course) return;

    // Trường hợp 1: Đã đăng ký nhưng chưa thanh toán -> Tiến hành thanh toán bằng ví học viên
    if (myBooking && myBooking.payment_status !== 'paid') {
      try {
        toast.info('Đang thực hiện thanh toán qua ví học viên...');
        const res = await bookingApi.payBooking(myBooking.booking_id);
        if (res && res.success) {
          toast.success('Thanh toán khóa học thành công! Bạn hiện đã có quyền xem video bài giảng.');
          setMyBooking((prev: any) => ({
            ...prev,
            payment_status: 'paid',
            status: 'confirmed'
          }));
          await checkEnrollmentStatus(course.type);
        } else {
          toast.error(res.error || 'Thanh toán thất bại.');
        }
      } catch (err: any) {
        console.error('Error paying for course:', err);
        const msg = err.response?.data?.error || err.message || 'Thanh toán thất bại do lỗi hệ thống.';
        toast.error(msg);
      }
      return;
    }

    // Trường hợp 2: Đã đăng ký và thanh toán thành công
    if (myBooking && myBooking.payment_status === 'paid') {
      return;
    }

    // Trường hợp 3: Chưa đăng ký -> Tạo đơn đặt lớp (Booking) ở trạng thái unpaid/pending
    const schedules = course.schedules || [];
    const availableSchedule = schedules.find((s: any) => s.status !== 'completed');

    try {
      toast.info('Đang xử lý đăng ký khóa học...');
      const res = await bookingApi.create({
        courseId: courseId,
        scheduleId: availableSchedule?.schedule_id,
        notes: course.isFree ? 'Đăng ký học miễn phí từ NovaLearn' : 'Đăng ký khóa học trả phí từ NovaLearn'
      });

      if (res && res.success) {
        if (course.isFree) {
          toast.success('Đăng ký khóa học miễn phí thành công! Đang chuyển đến bảng điều khiển...');
          setTimeout(() => navigate('/student/dashboard'), 1500);
        } else {
          toast.success('Đăng ký thành công! Vui lòng nhấn nút "Thanh toán ngay bằng Ví" để hoàn tất mua khóa học.');
          setMyBooking({
            booking_id: res.data?.booking_id || res.data?.id,
            payment_status: 'unpaid',
            status: 'pending'
          });
        }
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi đăng ký khóa học.');
      }
    } catch (err: any) {
      console.error('Error booking course:', err);
      const msg = err.response?.data?.error || err.message || 'Có lỗi xảy ra khi kết nối hệ thống.';
      toast.error(msg);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isAuthenticated) {
      setErrorMsg('Bạn cần đăng nhập để bình luận khóa học.');
      return;
    }

    if (!commentText.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bình luận.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await courseApi.createComment(courseId!, commentText.trim(), selectedRating);
      if (res && res.success) {
        setSuccessMsg('Đăng bình luận thành công!');
        setCommentText('');
        fetchCourseComments(courseId!);
      } else {
        setErrorMsg(res?.error || 'Có lỗi xảy ra khi gửi bình luận.');
      }
    } catch (err: any) {
      console.error('Error submitting course comment:', err);
      const msg = err.response?.data?.error || 'Có lỗi xảy ra khi gửi bình luận.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này không?')) return;
    try {
      const res = await courseApi.deleteComment(commentId);
      if (res && res.success) {
        setCommentsList(prev => prev.filter(c => c.comment_id !== commentId));
        toast.success('Xóa bình luận thành công');
      }
    } catch (err: any) {
      console.error('Error deleting course comment:', err);
      toast.error(err.response?.data?.error || 'Không thể xóa bình luận.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="stars-row" style={{ display: 'inline-flex', gap: '2px', color: '#ffb800' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rating ? "#ffb800" : "none"}
            color={i < rating ? "#ffb800" : "#cbd5e1"}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
        Đang tải thông tin chi tiết khóa học...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Không tìm thấy khóa học</h2>
        <Link to="/courses" className="submit-comment-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-view">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <Link to="/courses">Khóa học</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {course.title}
          </span>
        </div>
      </div>

      {/* 2. Hero Dark Banner */}
      <div className="detail-hero-banner">
        <div className="container detail-hero-layout">
          <div className="detail-hero-left">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className="detail-category-tag">{course.subject}</span>
              <span className="detail-category-tag" style={{
                background: course.type === 'offline' ? '#fef3c7' : '#e0e7ff',
                color: course.type === 'offline' ? '#d97706' : '#4338ca'
              }}>
                {course.type === 'offline' ? '📹 Offline (Video có sẵn)' : '🔴 Online (Live trực tuyến)'}
              </span>
            </div>
            <div className="detail-tutor-meta">
              bởi <span style={{ fontWeight: 600 }}>{course.instructor}</span>
            </div>
            <h1 className="detail-title">{course.title}</h1>

            <div className="detail-meta-list">
              {course.type === 'online' && course.start_date && (
                <div className="detail-meta-item">
                  <Clock size={16} color="var(--primary)" />
                  <span>Khai giảng: {new Date(course.start_date).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              {course.type === 'online' && course.end_date && (
                <div className="detail-meta-item">
                  <Clock size={16} color="#ef4444" />
                  <span>Bế giảng: {new Date(course.end_date).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              <div className="detail-meta-item">
                <Clock size={16} color="var(--primary)" />
                <span>{course.duration}</span>
              </div>
              <div className="detail-meta-item">
                <Users size={16} />
                <span>{course.studentsCount} Học viên</span>
              </div>
              <div className="detail-meta-item">
                <Award size={16} />
                <span>{course.level}</span>
              </div>
              <div className="detail-meta-item">
                <BookOpen size={16} />
                <span>{course.lessonsCount} Bài học</span>
              </div>
              <div className="detail-meta-item">
                <HelpCircle size={16} />
                <span>{course.quizzesCount} Bài kiểm tra</span>
              </div>
            </div>
          </div>

          <div></div>
        </div>

        {/* 3. Floating Sidebar Card */}
        <div className="container" style={{ position: 'relative', height: '0', overflow: 'visible' }}>
          <div className="detail-sidebar-card">
            <div className="detail-sidebar-img-wrapper">
              <img src={course.thumbnail} alt={course.title} className="detail-sidebar-img" />
            </div>

            <div className="detail-sidebar-body">
              <div className="detail-price-row">
                {course.isFree ? (
                  <span className="detail-price-main" style={{ color: '#10b981' }}>Miễn phí</span>
                ) : (
                  <span className="detail-price-main">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</span>
                )}
                {course.oldPrice && (
                  <span className="detail-price-original">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.oldPrice)}</span>
                )}
              </div>

              <button
                className="start-now-btn"
                onClick={handleStartNow}
                disabled={myBooking && myBooking.payment_status === 'paid'}
                style={
                  course.isFree
                    ? { background: 'linear-gradient(135deg, #10b981, #059669)' }
                    : (myBooking && myBooking.payment_status === 'paid'
                      ? { background: '#cbd5e1', color: '#64748b', cursor: 'default', boxShadow: 'none' }
                      : {}
                    )
                }
              >
                {course.isFree
                  ? '🎓 Đăng ký trọn gói ngay'
                  : (myBooking
                    ? (myBooking.payment_status === 'paid'
                      ? 'Đã đăng ký & Thanh toán ✓'
                      : `💳 Thanh toán bằng Ví (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)})`
                    )
                    : '💳 Đăng ký khóa học ngay'
                  )
                }
              </button>
              {course.isFree && (
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#10b981', marginTop: '8px', fontWeight: 500 }}>
                  ✓ Đăng ký trọn gói toàn bộ bài học & lịch trình
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Body Content */}
      <div className="container">
        <div className="detail-content-layout">

          <div className="detail-main-left">
            {/* Tabs Header */}
            <div className="tabs-container">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </button>
              <button
                className={`tab-button ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Chương trình học & Lịch trình
              </button>
              <button
                className={`tab-button ${activeTab === 'instructor' ? 'active' : ''}`}
                onClick={() => setActiveTab('instructor')}
              >
                Giảng viên
              </button>
              <button
                className={`tab-button ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                Hỏi đáp
              </button>
              <button
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá ({commentsList.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div>
                  {course.type === 'offline' && (
                    <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', marginBottom: '16px', color: '#92400e', fontSize: '14px', lineHeight: 1.5 }}>
                      <strong>📹 Khóa học Video Offline:</strong> Bạn có thể truy cập toàn bộ Video bài giảng và Tài liệu học tập bên dưới để tự học mọi lúc mọi nơi theo tiến độ cá nhân.
                    </div>
                  )}
                  {course.type === 'online' && (
                    <div style={{ padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', marginBottom: '16px', color: '#1e40af', fontSize: '14px', lineHeight: 1.5 }}>
                      <strong>🔴 Lớp Online Live:</strong> Học viên tham gia tương tác trực tuyến trực tiếp với Gia sư theo thời gian biểu hẹn trước.
                    </div>
                  )}
                  <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}</p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Lịch học cho khóa Online */}
                  {course.type === 'online' && (
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="var(--primary)" /> Lịch trình giảng dạy trực tuyến (Live)
                      </h4>
                      {course.course_days && course.course_days.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(79, 70, 229, 0.08)', padding: '10px 14px', borderRadius: '8px', color: '#4f46e5', fontWeight: 600, fontSize: '13px', marginBottom: '14px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                          <Clock size={16} /> Lịch học cố định hàng tuần: {course.course_days.map((cd: any) => {
                            const dayMap: Record<string, string> = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };
                            const val = cd.day_of_week || cd;
                            return dayMap[val] || val;
                          }).join(', ')}
                        </div>
                      )}
                      {course.schedules && course.schedules.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                          {course.schedules.map((sch: any, idx: number) => (
                            <div key={sch.schedule_id || idx} style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                              <div style={{ fontWeight: 600, color: '#334155' }}>
                                Buổi {idx + 1}: {new Date(sch.start_time).toLocaleDateString('vi-VN')}
                              </div>
                              <div style={{ color: 'var(--primary)', marginTop: '2px', fontWeight: 500 }}>
                                {new Date(sch.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Gia sư sẽ bổ sung khung giờ học trực tuyến chi tiết trước ngày khai giảng.</p>
                      )}
                    </div>
                  )}

                  {/* Bài giảng Video / Giáo trình */}
                  <div>
                    <h4 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                      Danh sách Bài giảng & Tài liệu học tập ({course.curriculum?.length || 0} bài)
                    </h4>
                    {course.curriculum && course.curriculum.length > 0 ? (
                      course.curriculum.map((item: any, i: number) => {
                        const embedUrl = getEmbedUrl(item.url);
                        return (
                          <div
                            key={item.id || i}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '14px 18px',
                              background: 'var(--bg-light)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border)',
                              gap: '12px',
                              flexWrap: 'wrap',
                              marginBottom: '10px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: item.type === 'video' ? '#eff6ff' : item.type === 'pdf' ? '#fef2f2' : '#f0fdf4',
                                color: item.type === 'video' ? '#2563eb' : item.type === 'pdf' ? '#dc2626' : '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {item.type === 'video' ? <Video size={20} /> : item.type === 'pdf' ? <FileText size={20} /> : <BookOpen size={20} />}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>
                                  Bài {i + 1}: {item.title}
                                </div>
                                {item.description && (
                                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {item.url && item.url !== '#' && (
                                embedUrl ? (
                                  <button
                                    onClick={() => {
                                      const userRole = authStorage.getUserRole();
                                      const isAuthor = userRole === 'tutor' && course.instructor === authStorage.getUserName();
                                      const isAdmin = userRole === 'admin';
                                      const isPaid = myBooking?.payment_status === 'paid' || myBooking?.status === 'confirmed' || myBooking?.status === 'completed';

                                      if (!course.isFree && !isPaid && !isAuthor && !isAdmin) {
                                        toast.error('Bạn cần phải đăng ký mua khóa học và thanh toán thành công mới có quyền xem video bài giảng này!');
                                        return;
                                      }
                                      setSelectedLessonModal(item);
                                    }}
                                    style={{
                                      border: 'none',
                                      background: 'var(--primary)',
                                      color: '#fff',
                                      fontSize: '13px',
                                      fontWeight: 600,
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    <PlayCircle size={15} /> Xem Video
                                  </button>
                                ) : (
                                  <a
                                    href={item.url}
                                    onClick={(e) => {
                                      const userRole = authStorage.getUserRole();
                                      const isAuthor = userRole === 'tutor' && course.instructor === authStorage.getUserName();
                                      const isAdmin = userRole === 'admin';
                                      const isPaid = myBooking?.payment_status === 'paid' || myBooking?.status === 'confirmed' || myBooking?.status === 'completed';

                                      if (!course.isFree && !isPaid && !isAuthor && !isAdmin) {
                                        e.preventDefault();
                                        toast.error('Bạn cần phải đăng ký mua khóa học và thanh toán thành công mới có quyền truy cập tài liệu này!');
                                      }
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: '13px',
                                      color: 'var(--primary)',
                                      fontWeight: 600,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      textDecoration: 'none',
                                      background: 'rgba(99, 102, 241, 0.1)',
                                      padding: '6px 12px',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    {item.type === 'pdf' ? 'Tải PDF' : 'Mở liên kết'} <ExternalLink size={14} />
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
                        Giảng viên chưa tải bài giảng nào lên cho khóa học này.
                      </p>
                    )}
                  </div>

                </div>
              )}


              {activeTab === 'instructor' && (
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '8px 0' }}>
                  <div style={{ flexShrink: 0 }}>
                    {course.instructorAvatar ? (
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
                      />
                    ) : (
                      <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
                        {course.instructor.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '20px', marginBottom: '4px' }}>{course.instructor}</h4>
                    {course.instructorSpecialization && (
                      <p style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                        {course.instructorSpecialization}
                      </p>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                      {course.instructorBio || `Giáo viên chuyên nghiệp có nhiều năm kinh nghiệm giảng dạy lĩnh vực ${course.subject}.`}
                    </p>
                    {authStorage.getUserRole() !== 'tutor' && authStorage.getUserRole() !== 'admin' && (
                      <button
                        onClick={handleToggleFavoriteTutor}
                        style={{
                          marginTop: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          background: isFavoriteTutor ? '#fef2f2' : '#fff',
                          color: isFavoriteTutor ? '#ef4444' : 'var(--text-main)',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <Heart size={16} fill={isFavoriteTutor ? '#ef4444' : 'none'} color={isFavoriteTutor ? '#ef4444' : '#64748b'} />
                        {isFavoriteTutor ? 'Đã yêu thích giảng viên' : 'Yêu thích giảng viên'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Khóa học này dành cho ai?</h4>
                    <p style={{ color: 'var(--text-muted)' }}>Khóa học phù hợp với mọi đối tượng từ cơ bản đến nâng cao có mong muốn học tập.</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Tôi có nhận được chứng chỉ sau khóa học không?</h4>
                    <p style={{ color: 'var(--text-muted)' }}>Có, sau khi hoàn thành toàn bộ bài kiểm tra và bài giảng, bạn sẽ nhận được chứng chỉ hoàn tất khóa học.</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{course.rating.toFixed(1)}</span>
                    <div>
                      {renderStars(course.rating)}
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Đánh giá trung bình ({commentsList.length} lượt nhận xét)</div>
                    </div>
                  </div>

                  {/* List of comments */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isLoadingComments ? (
                      <p style={{ color: 'var(--text-muted)' }}>Đang tải đánh giá...</p>
                    ) : commentsList.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>Chưa có đánh giá nào cho khóa học này.</p>
                    ) : (
                      commentsList.map((comm: any) => (
                        <div key={comm.comment_id} style={{ padding: '16px', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={comm.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt={comm.user?.full_name}
                                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>{comm.user?.full_name || comm.user?.email?.split('@')[0] || 'Người dùng'}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  {new Date(comm.created_at).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                            </div>
                            {comm.rating && renderStars(comm.rating)}
                          </div>
                          <p style={{ margin: '8px 0 0 0', fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)' }}>{comm.content}</p>
                          {(authStorage.getUserRole() === 'admin') && (
                            <button
                              onClick={() => handleDeleteComment(comm.comment_id)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', marginTop: '8px', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={12} /> Xóa đánh giá
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Leave A Comment / Review Form */}
            <div className="comments-section" style={{ marginTop: '40px' }}>
              <h3 className="comments-title">Để lại bình luận & Đánh giá</h3>

              {!isAuthenticated ? (
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', margin: '20px 0', border: '1px dashed var(--border)' }}>
                  <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 500 }}>
                    🔒 Bạn cần đăng nhập để tham gia bình luận và đánh giá khóa học.
                  </p>
                  <button
                    className="submit-comment-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn size={18} /> Đăng nhập ngay
                  </button>
                </div>
              ) : isCheckingEnrollment ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  Đang kiểm tra quyền bình luận...
                </div>
              ) : enrollmentStatus && !enrollmentStatus.canComment ? (
                // Locked: Student has not purchased or not completed the course
                <div style={{
                  padding: '20px 24px',
                  backgroundColor: '#fef9ec',
                  border: '1px dashed #f59e0b',
                  borderRadius: 'var(--radius-md)',
                  margin: '16px 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>🔒</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: '#92400e', marginBottom: '6px' }}>
                      Chưa đủ điều kiện bình luận & đánh giá
                    </p>
                    <p style={{ fontSize: '14px', color: '#a16207', lineHeight: 1.6, margin: 0 }}>
                      {enrollmentStatus.reason}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Bình luận với tài khoản: <strong style={{ color: 'var(--primary)' }}>{userName}</strong>
                  </p>

                  {errorMsg && (
                    <div style={{ padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <AlertCircle size={18} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div style={{ padding: '12px', background: '#ecfdf5', color: '#059669', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <CheckCircle2 size={18} />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Chọn mức độ đánh giá (Điểm số):</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            type="button"
                            key={starNum}
                            onClick={() => setSelectedRating(starNum)}
                            style={{
                              background: selectedRating >= starNum ? '#fef3c7' : 'var(--bg-light)',
                              border: selectedRating >= starNum ? '1px solid #f59e0b' : '1px solid var(--border)',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600,
                              color: selectedRating >= starNum ? '#d97706' : 'var(--text-muted)'
                            }}
                          >
                            <Star size={14} fill={selectedRating >= starNum ? '#f59e0b' : 'none'} color={selectedRating >= starNum ? '#f59e0b' : '#94a3b8'} />
                            {starNum} Sao
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="course-comment-text">Nội dung bình luận*</label>
                      <textarea
                        id="course-comment-text"
                        className="form-input form-textarea"
                        required
                        rows={4}
                        placeholder="Viết nhận xét của bạn về khóa học này..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="submit-comment-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang gửi...' : 'Đăng bình luận & Đánh giá'}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>

          <div></div>

        </div>
      </div>
      {/* Video Modal Player */}
      {selectedLessonModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-card" style={{ maxWidth: '800px', width: '95%', padding: '20px' }}>
            <div className="modal-header" style={{ marginBottom: '15px' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0 }}>{selectedLessonModal.title}</h3>
                {selectedLessonModal.description && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{selectedLessonModal.description}</p>
                )}
              </div>
              <button onClick={() => setSelectedLessonModal(null)} className="btn-close" style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {getEmbedUrl(selectedLessonModal.url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', background: '#000' }}>
                <iframe
                  src={getEmbedUrl(selectedLessonModal.url)!}
                  title={selectedLessonModal.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <a
                  href={selectedLessonModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
                >
                  <ExternalLink size={18} /> Mở tệp / Bài học ở cửa sổ mới
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
