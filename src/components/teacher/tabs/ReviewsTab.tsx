import React from 'react';

interface ReviewsTabProps {
  reviews: any[];
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  return (
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
  );
};
