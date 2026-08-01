import React from 'react';


interface SchedulesTabProps {
  classSessions?: any[];
  formatDateString: (s: string) => string;
}

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  classSessions = [],
  formatDateString
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Lịch Học Thực Tế (Class Sessions)</h2>
      </div>

      <div className="table-responsive">
        <table className="db-table">
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Buổi học</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Học viên</th>
              <th>Phòng học</th>
            </tr>
          </thead>
          <tbody>
            {classSessions.map((session: any) => (
              <tr key={session.session_id}>
                <td style={{ fontWeight: 600 }}>{session.course_title}</td>
                <td>{session.title}</td>
                <td>{formatDateString(session.scheduled_start)}</td>
                <td>{formatDateString(session.scheduled_end)}</td>
                <td>
                  <span className={`badge ${session.status === 'scheduled' ? 'badge-confirmed' : 'badge-draft'}`}>
                    {session.status}
                  </span>
                </td>
                <td>
                  <div className="user-cell">
                    <span style={{ fontWeight: 500 }}>{session.student_name}</span>
                  </div>
                </td>
                <td>{session.room_id || '-'}</td>
              </tr>
            ))}
            {classSessions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                  Chưa có lịch học thực tế nào được sinh ra từ các đăng ký học.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
