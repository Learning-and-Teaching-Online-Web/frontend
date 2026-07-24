import React from 'react';

interface BookingsTabProps {
  bookings: any[];
  formatVND: (n: number) => string;
  formatDateString: (s: string) => string;
  handleConfirmBooking: (id: string) => void;
  handleCancelBooking: (id: string) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  formatVND,
  formatDateString,
  handleConfirmBooking,
  handleCancelBooking
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Tất cả yêu cầu đăng ký học lớp</h2>
      </div>

      <div className="table-responsive">
        <table className="db-table">
          <thead>
            <tr>
              <th>Học sinh</th>
              <th>Khóa học</th>
              <th>Thời gian lớp</th>
              <th>Số tiền thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const studentName = b.student?.user?.full_name || b.student_name || 'Học sinh';
              const studentEmail = b.student?.user?.email || b.student_email || '';
              const studentAvatar = b.student?.user?.avatar_url || b.student_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60';
              const courseTitle = b.course?.title || b.course_title || 'Khóa học';
              const startTime = b.schedule?.start_time || b.start_time;

              return (
                <tr key={b.booking_id}>
                  <td>
                    <div className="user-cell">
                      <img src={studentAvatar} alt={studentName} />
                      <div>
                        <span className="user-name">{studentName}</span>
                        <span className="user-sub">{studentEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>{courseTitle}</td>
                  <td>{formatDateString(startTime)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{formatVND(Number(b.total_amount))}</td>
                  <td>
                    <span className={`badge badge-${b.status}`}>
                      {b.status === 'pending' && 'Đang chờ duyệt'}
                      {b.status === 'confirmed' && 'Đã duyệt'}
                      {b.status === 'completed' && 'Hoàn thành'}
                      {b.status === 'cancelled' && 'Đã hủy'}
                    </span>
                  </td>
                  <td>
                    {b.status === 'pending' && (
                      <div className="actions-group">
                        <button
                          className="btn-action-success"
                          onClick={() => handleConfirmBooking(b.booking_id)}
                        >
                          Duyệt học
                        </button>
                        <button
                          className="btn-action-danger"
                          onClick={() => handleCancelBooking(b.booking_id)}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                    {b.status === 'confirmed' && (
                      <button
                        className="btn-action-danger"
                        onClick={() => handleCancelBooking(b.booking_id)}
                      >
                        Hủy buổi học
                      </button>
                    )}
                    {b.status !== 'pending' && b.status !== 'confirmed' && (
                      <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '13px' }}>Không có</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                  Chưa có yêu cầu đặt lớp nào từ học sinh.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
