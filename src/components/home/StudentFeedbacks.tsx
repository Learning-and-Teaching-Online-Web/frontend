import React, { useState, useEffect } from 'react';
import { reviewApi } from '../../services/reviewApi';

const StudentFeedbacks: React.FC = () => {
  const [feedbacksList, setFeedbacksList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const res = await reviewApi.getVisible();
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((r: any) => ({
            text: r.comment || 'Khóa học tuyệt vời!',
            author: r.student?.user?.full_name || 'Học viên ẩn danh',
            role: 'Học viên'
          }));
          setFeedbacksList(mapped);
        }
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <section className="student-feedbacks-section" style={{ padding: '40px 0 60px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-title-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Phản hồi của học viên</h2>
            <p>Học viên nói gì về Academy LMS</p>
          </div>
        </div>

        {/* Feedbacks Row */}
        <div className="feedback-cards-row">
          {isLoading ? (
            <div style={{ width: '100%', padding: '40px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              Đang tải phản hồi từ học viên...
            </div>
          ) : feedbacksList.length > 0 ? (
            feedbacksList.map((fb, idx) => (
              <div key={idx} className="feedback-card-home">
                <div className="feedback-quote-icon">“</div>
                <p className="feedback-text-home">{fb.text}</p>
                <div className="feedback-author-info">
                  <span className="feedback-author-name">{fb.author}</span>
                  <span className="feedback-author-role">{fb.role}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ width: '100%', padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              Chưa có phản hồi nào được ghi nhận.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default StudentFeedbacks;
