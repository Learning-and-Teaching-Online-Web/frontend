import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Star, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import type { EnrolledCourse } from '../../../data/mockStudentData';
import ReviewModal from '../ReviewModal';
import '../../../styles/student/CoursesTab.css';

interface CoursesTabProps {
  enrolledCourses: EnrolledCourse[];
  formatDate: (isoString: string) => string;
  onPay?: (bookingId: string) => Promise<boolean>;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  enrolledCourses,
  formatDate,
  onPay
}) => {
  const navigate = useNavigate();
  const [selectedCourseForReview, setSelectedCourseForReview] = useState<EnrolledCourse | null>(null);
  const [reviewedCourseIds, setReviewedCourseIds] = useState<Set<string>>(new Set());

  const handleReviewSuccess = (bookingId: string) => {
    setReviewedCourseIds(prev => new Set(prev).add(bookingId));
  };

  const canReviewCourse = (course: EnrolledCourse): { allowed: boolean; reason?: string } => {
    if (course.booking_id && reviewedCourseIds.has(course.booking_id)) {
      return { allowed: false, reason: 'Đã đánh giá' };
    }
    if (course.isReviewed) {
      return { allowed: false, reason: 'Đã đánh giá' };
    }

    const isOffline = course.type === 'offline';
    const isPaid = course.paymentStatus === 'paid' || course.bookingStatus === 'confirmed' || course.bookingStatus === 'completed';

    if (isOffline) {
      if (isPaid) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Cần thanh toán trước' };
    } else {
      // Online course
      if (course.bookingStatus === 'completed') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Cần kết thúc khóa học' };
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Khóa học của tôi</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tổng số: {enrolledCourses.length} khóa học</span>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="courses-grid">
          {enrolledCourses.map(course => {
            const reviewStatus = canReviewCourse(course);
            const isAlreadyReviewed = course.isReviewed || (course.booking_id && reviewedCourseIds.has(course.booking_id));
            const isUnpaid = course.paymentStatus === 'unpaid';

            return (
              <div key={course.course_id} className="enrolled-course-card">
                <div className="enrolled-thumb-wrapper">
                  <img src={course.thumbnail} alt={course.title} className="enrolled-thumb" />
                  <span className="enrolled-subject-tag">
                    {course.subject} ({course.type === 'offline' ? 'Offline' : 'Online'})
                  </span>
                </div>

                <div className="enrolled-info">
                  <h3>{course.title}</h3>
                  <p className="enrolled-instructor">Giáo viên: {course.instructor}</p>

                  {isUnpaid && (
                    <div style={{ margin: '8px 0', padding: '6px 10px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>
                      ⚠️ Khóa học này chưa được thanh toán học phí!
                    </div>
                  )}

                  <div className="enrolled-progress-section">
                    <div className="progress-header">
                      <span>Tiến độ ({course.completedLessons}/{course.totalLessons} bài học)</span>
                      <span className="percentage">{course.progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="enrolled-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    <span className="enrolled-next-session">
                      <Clock size={14} />
                      Lớp tới: {course.nextSessionTime ? formatDate(course.nextSessionTime) : 'Chưa xếp lịch'}
                    </span>

                    <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end', marginTop: '6px', flexWrap: 'wrap' }}>
                      {/* Button pay now if unpaid */}
                      {isUnpaid && onPay && (
                        <button
                          onClick={async () => {
                            if (course.booking_id && window.confirm(`Bạn xác nhận thanh toán học phí cho khóa học "${course.title}"?`)) {
                              await onPay(course.booking_id);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                          }}
                        >
                          Thanh toán ngay
                        </button>
                      )}

                      {/* Button Review */}
                      {isAlreadyReviewed ? (
                        <button
                          disabled
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            fontSize: '13px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'default'
                          }}
                        >
                          <Check size={14} /> Đã đánh giá
                        </button>
                      ) : reviewStatus.allowed ? (
                        <button
                          onClick={() => setSelectedCourseForReview(course)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          <Star size={14} fill="#ffffff" /> Đánh giá ⭐
                        </button>
                      ) : (
                        <button
                          disabled
                          title={reviewStatus.reason}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#64748b',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'not-allowed'
                          }}
                        >
                          {reviewStatus.reason}
                        </button>
                      )}

                      <button
                        className="btn-learn"
                        onClick={() => {
                          if (isUnpaid) {
                            toast.error(`Bạn cần phải thanh toán học phí cho khóa "${course.title}" trước khi vào học!`);
                            return;
                          }
                          if ((course.type as string) === 'offline' || (course.type as string) === 'video') {
                            navigate(`/courses/${course.course_id}`);
                          } else {
                            toast.info(`Bắt đầu vào lớp: ${course.title}. Hệ thống LMS đang được tải...`);
                          }
                        }}
                        style={isUnpaid ? { background: '#94a3b8', cursor: 'not-allowed' } : {}}
                      >
                        Vào học
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <BookOpen size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Bạn chưa đăng ký khóa học nào. Hãy đăng ký khóa học ngay!</p>
          <Link to="/courses" className="btn-save-profile" style={{ marginTop: '20px', textDecoration: 'none' }}>
            Khám phá khóa học
          </Link>
        </div>
      )}

      {/* REVIEW MODAL */}
      {selectedCourseForReview && (
        <ReviewModal
          isOpen={!!selectedCourseForReview}
          onClose={() => setSelectedCourseForReview(null)}
          bookingId={selectedCourseForReview.booking_id || selectedCourseForReview.course_id}
          tutorName={selectedCourseForReview.instructor}
          courseTitle={selectedCourseForReview.title}
          onSuccess={() => selectedCourseForReview.booking_id && handleReviewSuccess(selectedCourseForReview.booking_id)}
        />
      )}
    </div>
  );
};
