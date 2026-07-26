import React from 'react';
import { DollarSign, ChevronRight } from 'lucide-react';
import type { TeacherTab } from '../../../hooks/useTeacherDashboard';

interface OverviewTabProps {
  bookings: any[];
  walletBalance: number;
  formatVND: (n: number) => string;
  formatDateString: (s: string) => string;
  setActiveTab: (t: TeacherTab) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
  handleConfirmBooking: (id: string) => void;
  handleCancelBooking: (id: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  bookings,
  walletBalance,
  formatVND,
  formatDateString,
  setActiveTab,
  setIsWithdrawModalOpen,
  handleConfirmBooking,
  handleCancelBooking
}) => {
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <div className="overview-layout">
      {/* Recent Bookings Section */}
      <div className="section-card">
        <div className="section-header">
          <h2>Yêu cầu đăng ký học mới nhất</h2>
          <button className="btn-secondary-db" onClick={() => setActiveTab('bookings')}>
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Khóa học</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.slice(0, 3).map(b => {
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
                    <td><span className="badge badge-pending">Đang chờ</span></td>
                    <td>
                      <div className="actions-group">
                        <button
                          className="btn-action-success"
                          onClick={() => handleConfirmBooking(b.booking_id)}
                        >
                          Phê duyệt
                        </button>
                        <button
                          className="btn-action-danger"
                          onClick={() => handleCancelBooking(b.booking_id)}
                        >
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pendingBookings.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                    Không có yêu cầu đăng ký học mới nào cần phê duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet/Earnings Summary */}
      <div className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="section-header">
            <h2>Ví gia sư</h2>
          </div>
          <div className="wallet-card" style={{ padding: '20px', borderRadius: '15px' }}>
            <div className="wallet-details">
              <span className="wallet-label">Số dư khả dụng</span>
              <span className="wallet-balance" style={{ fontSize: '24px' }}>{formatVND(walletBalance)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn-primary-db" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsWithdrawModalOpen(true)}>
            <DollarSign size={16} /> Rút tiền về ngân hàng
          </button>
          <button className="btn-secondary-db" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('wallet')}>
            Xem lịch sử giao dịch
          </button>
        </div>
      </div>
    </div>
  );
};
