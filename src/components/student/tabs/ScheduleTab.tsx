import React, { useState, useEffect } from 'react';
import { Clock, User, Video, Star, Check } from 'lucide-react';
import type { ClassSession } from '../../../data/mockStudentData';
import ReviewModal from '../ReviewModal';
import { Pagination } from '../../Pagination';
import '../../../styles/student/ScheduleTab.css';

export interface ScheduleTabProps {
  classSessions: ClassSession[];
  formatTime?: (isoString: string) => string;
  onJoinRoom?: (scheduleId: string) => void;
}

/**
 * Helper ánh xạ trạng thái sang class badge và tiêu đề hiển thị tương ứng
 * - upcoming / scheduled: Xanh dương
 * - ongoing: Xanh lá
 * - completed: Xám
 * - cancelled: Đỏ
 */
export const getStatusBadgeInfo = (status: string) => {
  const normalized = status?.toLowerCase() || '';
  switch (normalized) {
    case 'upcoming':
    case 'scheduled':
      return {
        className: 'status-badge upcoming',
        text: 'Sắp diễn ra'
      };
    case 'ongoing':
      return {
        className: 'status-badge ongoing',
        text: 'Đang học'
      };
    case 'completed':
      return {
        className: 'status-badge completed',
        text: 'Hoàn thành'
      };
    case 'cancelled':
      return {
        className: 'status-badge cancelled',
        text: 'Đã hủy'
      };
    default:
      return {
        className: `status-badge ${normalized || 'unknown'}`,
        text: status || 'Chưa xác định'
      };
  }
};

const defaultFormatTime = (isoString: string) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  classSessions = [],
  formatTime = defaultFormatTime,
  onJoinRoom
}) => {
  const [selectedSessionForReview, setSelectedSessionForReview] = useState<ClassSession | null>(null);
  const [reviewedSessionIds, setReviewedSessionIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const handleReviewSuccess = (sessionId: string) => {
    setReviewedSessionIds(prev => new Set(prev).add(sessionId));
  };

  const safeSessions = Array.isArray(classSessions) ? classSessions : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [safeSessions.length]);

  const totalPages = Math.ceil(safeSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = safeSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="content-header">
        <h2>Lịch học trực tuyến</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Danh sách các buổi học 1-kèm-1 và lớp trực tuyến</span>
      </div>

      {safeSessions.length > 0 ? (
        <>
          <div className="schedule-list" data-testid="schedule-list">
            {paginatedSessions.map(session => {
            const sessionDate = new Date(session.startTime);
            const isValidDate = !isNaN(sessionDate.getTime());
            const day = isValidDate ? sessionDate.getDate() : '--';
            const month = isValidDate ? `Thg ${sessionDate.getMonth() + 1}` : '--';
            const isReviewed = reviewedSessionIds.has(session.session_id);
            const badgeInfo = getStatusBadgeInfo(session.status);

            return (
              <div
                key={session.session_id}
                className="schedule-item"
                data-testid="schedule-card"
                data-session-id={session.session_id}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="schedule-time-box">
                    <span className="time-box-day">{day}</span>
                    <span className="time-box-month">{month}</span>
                  </div>

                  <div className="schedule-details">
                    <h3>
                      {session.sessionTitle
                        ? `${session.courseTitle} — ${session.sessionTitle}`
                        : session.courseTitle}
                    </h3>
                    <div className="schedule-meta">
                      <span>
                        <Clock size={14} />
                        {formatTime(session.startTime) || '--:--'} - {formatTime(session.endTime) || '--:--'}
                      </span>
                      <span>
                        <User size={14} />
                        Gia Sư: {session.tutorName}
                      </span>
                      <span className={badgeInfo.className} data-testid="status-badge">
                        {badgeInfo.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {session.status === 'scheduled' || session.status === 'upcoming' || session.status === 'ongoing' ? (
                    <a
                      href={session.meetingLink || `/classroom/${session.schedule_id || session.session_id}`}
                      onClick={(e) => {
                        const targetId = session.schedule_id || session.session_id;
                        if (onJoinRoom && targetId) {
                          e.preventDefault();
                          onJoinRoom(targetId);
                        }
                      }}
                      className="btn-meeting-link"
                    >
                      <Video size={16} />
                      Vào phòng học
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="empty-schedule-message" data-testid="empty-schedule" style={{ color: 'var(--text-muted)' }}>
          Chưa có lịch học nào
        </p>
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
