import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, BookOpen, HelpCircle, Star, Award, LogIn, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { courseApi, mapBackendCourseToFrontend } from '../services/courseApi';
import { bookingApi } from '../services/bookingApi';
import authStorage from '../utils/authStorage';
import '../styles/CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs' | 'reviews'>('overview');
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auth states
  const isAuthenticated = authStorage.isAuthenticated();
  const userName = authStorage.getUserName() || 'Người dùng';

  // Course Comments states
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        const res = await courseApi.getDetail(courseId);
        if (res && res.success && res.data) {
          const mapped = mapBackendCourseToFrontend(res.data);
          setCourse(mapped);
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
  }, [courseId]);

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

    if (!course.isFree) {
      toast.info('Khóa học này có phí. Tính năng thanh toán đang được phát triển. Vui lòng liên hệ để được hỗ trợ.');
      return;
    }

    const schedules = course.schedules || [];
    const availableSchedule = schedules.find((s: any) => !s.is_booked);

    try {
      toast.info('Đang xử lý đăng ký khóa học...');
      const res = await bookingApi.create({
        courseId: courseId,
        scheduleId: availableSchedule?.schedule_id,
        notes: 'Đăng ký học miễn phí từ NovaLearn'
      });

      if (res && res.success) {
        toast.success('Đăng ký khóa học miễn phí thành công! Chuyển đến bảng điều khiển...');
        setTimeout(() => navigate('/student/dashboard'), 1500);
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
            <span className="detail-category-tag">{course.subject}</span>
            <div className="detail-tutor-meta">
              bởi <span style={{ fontWeight: 600 }}>{course.instructor}</span>
            </div>
            <h1 className="detail-title">{course.title}</h1>
            
            <div className="detail-meta-list">
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
                  <span className="detail-price-main">${course.price.toFixed(1)}</span>
                )}
                {course.oldPrice && (
                  <span className="detail-price-original">${course.oldPrice.toFixed(1)}</span>
                )}
              </div>

              <button 
                className="start-now-btn"
                onClick={handleStartNow}
                style={course.isFree ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : {}}
              >
                {course.isFree ? '🎓 Đăng ký miễn phí ngay' : '💳 Đăng ký (Sắp hỗ trợ thanh toán)'}
              </button>
              {course.isFree && (
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#10b981', marginTop: '8px', fontWeight: 500 }}>
                  ✓ Hoàn toàn miễn phí, không cần thẻ tín dụng
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
                Chương trình học
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
                  <p>{course.description}</p>
                  <p>LearnPress là một hệ thống quản lý học tập toàn diện cho việc đào tạo trực tuyến. Bạn có thể xem lộ trình giảng dạy, làm các bài kiểm tra thực hành và tương tác với giảng viên một cách trực quan.</p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h4 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Chương trình giảng dạy ({course.lessonsCount} bài học)</h4>
                  {[...Array(Math.max(course.lessonsCount, 3))].map((_, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 500 }}>Bài {i + 1}: Hướng dẫn nội dung kiến thức chuyên đề {i + 1}</span>
                      <span style={{ color: 'var(--text-muted)' }}>60 phút</span>
                    </div>
                  ))}
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
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>{comm.user?.full_name || 'Người dùng'}</div>
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
    </div>
  );
};

export default CourseDetail;
