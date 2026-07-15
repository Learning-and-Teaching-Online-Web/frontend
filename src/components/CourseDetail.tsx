import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, BookOpen, HelpCircle, Star, Award } from 'lucide-react';
import { mockCourses } from '../data/mockData';
import '../styles/CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'faqs' | 'reviews'>('overview');
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '', saveDetails: false });

  const course = mockCourses.find(c => c.course_id === courseId);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Cảm ơn bạn đã để lại bình luận!\nTên: ${commentForm.name}\nBình luận: ${commentForm.comment}`);
    setCommentForm({ name: '', email: '', comment: '', saveDetails: false });
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

  return (
    <div className="detail-view">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Homepage</Link>
          <span className="breadcrumbs-separator">/</span>
          <Link to="/courses">Course</Link>
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
              by <span style={{ fontWeight: 600 }}>{course.instructor}</span>
            </div>
            <h1 className="detail-title">{course.title}</h1>
            
            <div className="detail-meta-list">
              <div className="detail-meta-item">
                <Clock size={16} color="var(--primary)" />
                <span>{course.duration}</span>
              </div>
              <div className="detail-meta-item">
                <Users size={16} />
                <span>{course.studentsCount} Students</span>
              </div>
              <div className="detail-meta-item">
                <Award size={16} />
                <span>{course.level}</span>
              </div>
              <div className="detail-meta-item">
                <BookOpen size={16} />
                <span>{course.lessonsCount} Lessons</span>
              </div>
              <div className="detail-meta-item">
                <HelpCircle size={16} />
                <span>{course.quizzesCount} Quizzes</span>
              </div>
            </div>
          </div>
          
          {/* Right card placeholder space in layout */}
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
                  <span className="detail-price-main" style={{ color: '#10b981' }}>Free</span>
                ) : (
                  <span className="detail-price-main">${course.price.toFixed(1)}</span>
                )}
                {course.oldPrice && (
                  <span className="detail-price-original">${course.oldPrice.toFixed(1)}</span>
                )}
              </div>

              <button 
                className="start-now-btn"
                onClick={() => alert(`Đăng ký khóa học "${course.title}" thành công!`)}
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Body Content (Left column for tabs, right column is empty due to floating card) */}
      <div className="container">
        <div className="detail-content-layout">
          
          <div className="detail-main-left">
            {/* Tabs Header */}
            <div className="tabs-container">
              <button 
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Curriculum
              </button>
              <button 
                className={`tab-button ${activeTab === 'instructor' ? 'active' : ''}`}
                onClick={() => setActiveTab('instructor')}
              >
                Instructor
              </button>
              <button 
                className={`tab-button ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </button>
              <button 
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div>
                  <p>{course.description}</p>
                  <p>LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online. You can create a course curriculum with lessons & quizzes included which is managed with an easy-to-use interface for users. Having this WordPress LMS Plugin, now you have a chance to quickly and easily create education, online school, online-course websites with no coding knowledge required.</p>
                  <p>LearnPress is free and always will be, but it is still a premium high-quality WordPress Plugin that definitely helps you with making money from your WordPress Based LMS. Just try and see how amazing it is. LearnPress WordPress Online Course plugin is lightweight and super powerful with lots of Add-Ons to empower its core system. How to use WPML Add-on for LearnPress? No comments yet! You be the first to comment.</p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h4 style={{ fontSize: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Chương trình giảng dạy ({course.lessonsCount} bài học)</h4>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 500 }}>Bài {i + 1}: Hướng dẫn nhập môn và cài đặt cơ bản</span>
                      <span style={{ color: 'var(--text-muted)' }}>15:00</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '20px' }}>{course.instructor}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Giáo viên chuyên nghiệp hơn 10 năm kinh nghiệm giảng dạy lĩnh vực {course.subject}.</p>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{course.rating.toFixed(1)}</span>
                    <div>
                      {renderStars(course.rating)}
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Đánh giá trung bình ({course.reviewCount} nhận xét)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leave A Comment Form */}
            <div className="comments-section">
              <h3 className="comments-title">Leave A Comment</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Your email address will not be published. Required fields are marked *
              </p>

              <form className="comment-form" onSubmit={handleFormSubmit}>
                <div className="comment-form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="comment-name">Name*</label>
                    <input 
                      type="text" 
                      id="comment-name" 
                      className="form-input" 
                      required 
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="comment-email">Email*</label>
                    <input 
                      type="email" 
                      id="comment-email" 
                      className="form-input" 
                      required 
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="comment-text">Comment*</label>
                  <textarea 
                    id="comment-text" 
                    className="form-input form-textarea" 
                    required 
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                  />
                </div>

                <label className="checkbox-consent">
                  <input 
                    type="checkbox" 
                    checked={commentForm.saveDetails}
                    onChange={(e) => setCommentForm({ ...commentForm, saveDetails: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Save my name, email in this browser for the next time I comment</span>
                </label>

                <button type="submit" className="submit-comment-btn">
                  Post Comment
                </button>
              </form>
            </div>

          </div>

          {/* Right Column Spacer for floating sidebar layout */}
          <div></div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
