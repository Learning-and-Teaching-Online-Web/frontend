import React, { useState } from 'react';
import { Clock, User, Video, Star, Check } from 'lucide-react';
import type { ClassSession } from '../../../data/mockStudentData';
import ReviewModal from '../ReviewModal';
import '../../../styles/student/ScheduleTab.css';

interface ScheduleTabProps {
  classSessions: ClassSession[];
  formatTime: (isoString: string) => string;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  classSessions,
  formatTime
}) => {
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<ClassSession | null>(null);
  const [reviewedSessionIds, setReviewedSessionIds] = useState<Set<string>>(new Set());

  const handleReviewSuccess = (sessionId: string) => {
    setReviewedSessionIds(prev => new Set(prev).add(sessionId));
  };

  return (
    <div>
      <div className="content-header">
        <h2>Lịch học trực tuyến</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Danh sách các buổi học 1-kèm-1 và lớp trực tuyến</span>
      </div>

      {classSessions.length > 0 ? (
        <div className="schedule-list">
          {classSessions.map(session => {
            const sessionDate = new Date(session.startTime);
            const day = sessionDate.getDate();
            const month = `Thg ${sessionDate.getMonth() + 1}`;
            const isReviewed = reviewedSessionIds.has(session.session_id);
            
            return (
              <div key={session.session_id} className="schedule-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="schedule-time-box">
                    <span className="time-box-day">{day}</span>
                    <span className="time-box-month">{month}</span>
                  </div>
                  
                  <div className="schedule-details">
                    <h3>{session.courseTitle}</h3>
                    <div className="schedule-meta">
                      <span>
                        <Clock size={14} />
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </span>
                      <span>
                        <User size={14} />
                        Giảng viên: {session.tutorName}
                      </span>
                      <span className={`status-badge ${session.status}`}>
                        {session.status === 'scheduled' ? 'Sắp diễn ra' : 
                         session.status === 'completed' ? 'Hoàn thành' : 
                         session.status === 'ongoing' ? 'Đang học' : 'Đã hủy'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {session.status === 'scheduled' || session.status === 'ongoing' ? (
                    <a 
                      href={session.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-meeting-link"
                    >
                      <Video size={16} />
                      Vào phòng học Zoom
                    </a>
                  ) : (
                    <>
                      <button 
                        className="btn-meeting-link" 
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      >
                        Đã kết thúc
                      </button>

                      {session.status === 'completed' && (
                        isReviewed ? (
                          <button
                            disabled
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              fontSize: '13px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'default'
                            }}
                          >
                            <Check size={14} /> Đã đánh giá
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedSessionForReview(session)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <Star size={14} fill="#ffffff" /> Đánh giá ⭐
                          </button>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>Bạn chưa có lịch học nào.</p>
      )}

      {/* REVIEW MODAL */}
      {selectedSessionForReview && (
        <ReviewModal
          isOpen={!!selectedSessionForReview}
          onClose={() => setSelectedSessionForReview(null)}
          bookingId={selectedSessionForReview.booking_id || selectedSessionForReview.session_id}
          tutorName={selectedSessionForReview.tutorName}
          courseTitle={selectedSessionForReview.courseTitle}
          onSuccess={() => handleReviewSuccess(selectedSessionForReview.session_id)}
        />
      )}
    </div>
  );
};
