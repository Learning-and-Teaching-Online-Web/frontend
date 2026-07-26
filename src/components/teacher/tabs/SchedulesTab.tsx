import React from 'react';
import { Plus } from 'lucide-react';

interface SchedulesTabProps {
  allSchedules: any[];
  formatDateString: (s: string) => string;
  setIsScheduleModalOpen: (open: boolean) => void;
}

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  allSchedules,
  formatDateString,
  setIsScheduleModalOpen
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Quản lý lịch dạy của gia sư</h2>
        <button className="btn-primary-db" onClick={() => setIsScheduleModalOpen(true)}>
          <Plus size={16} /> Thêm khung giờ dạy
        </button>
      </div>

      <div className="table-responsive">
        <table className="db-table">
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Học sinh đăng ký</th>
            </tr>
          </thead>
          <tbody>
            {allSchedules.map((sch: any) => (
              <tr key={sch.schedule_id}>
                <td style={{ fontWeight: 600 }}>{sch.course_title}</td>
                <td>{formatDateString(sch.start_time)}</td>
                <td>{formatDateString(sch.end_time)}</td>
                <td>
                  <span className={`badge ${sch.is_booked ? 'badge-confirmed' : 'badge-draft'}`}>
                    {sch.is_booked ? 'Đã được đặt' : 'Đang trống'}
                  </span>
                </td>
                <td>
                  {sch.is_booked ? (
                    <div className="user-cell">
                      <span style={{ fontWeight: 500 }}>{sch.student_name || 'Học sinh'}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Chưa có</span>
                  )}
                </td>
              </tr>
            ))}
            {allSchedules.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                  Chưa cấu hình lịch dạy nào. Bấm vào nút "Thêm khung giờ dạy" để tạo khung giờ rảnh.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
