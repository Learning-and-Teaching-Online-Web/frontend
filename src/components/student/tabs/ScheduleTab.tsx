import React from 'react';
import { Clock, User, Video } from 'lucide-react';
import type { ClassSession } from '../../../data/mockStudentData';
import '../../../styles/student/ScheduleTab.css';

interface ScheduleTabProps {
  classSessions: ClassSession[];
  formatTime: (isoString: string) => string;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  classSessions,
  formatTime
}) => {
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
                  <button 
                    className="btn-meeting-link" 
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  >
                    Đã kết thúc
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>Bạn chưa có lịch học nào.</p>
      )}
    </div>
  );
};
