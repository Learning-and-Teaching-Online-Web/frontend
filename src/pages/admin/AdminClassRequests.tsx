import React, { useEffect, useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { CheckCircle2, UserCheck, Eye, X, ClipboardList, Filter, Search } from 'lucide-react';

interface Application {
  application_id: string;
  applicant_phone: string;
  available_date?: string;
  available_from?: string;
  notes?: string;
  status: string;
  created_at: string;
  tutor?: {
    tutor_id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface ClassRequest {
  request_id: string;
  code: string;
  student_name: string;
  phone: string;
  address_detail: string;
  district?: string;
  province?: string;
  grade_level?: string;
  subject_name: string;
  sessions_per_week: number;
  study_time?: string;
  tutor_requirement?: string;
  desired_price: number;
  commission_rate: number;
  status: string;
  created_at: string;
  selected_tutor?: { full_name: string; phone?: string };
  assigned_tutor?: { full_name: string; phone?: string };
  payment_deadline?: string;
  fee_amount?: number;
  _count?: { applications: number };
}

const AdminClassRequests: React.FC = () => {
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedClass, setSelectedClass] = useState<ClassRequest | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const commissionRate = 35;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/class-requests', {
        params: { status: statusFilter, search: searchQuery },
      });
      if (res.data && res.data.data) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin requests:', err);
      toast.error('Lỗi khi lấy danh sách yêu cầu lớp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const handleApproveOpen = async (requestId: string) => {
    try {
      const res = await axiosClient.patch(`/admin/class-requests/${requestId}/approve-open`, {
        commission_rate: commissionRate,
      });
      toast.success(res.data.message || 'Đã duyệt mở lớp công khai thành công!');
      fetchRequests();
    } catch (err: any) {
      console.error('Error approving open:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt mở lớp.');
    }
  };

  const handleOpenApplicationsModal = async (cls: ClassRequest) => {
    setSelectedClass(cls);
    setModalOpen(true);
    try {
      const res = await axiosClient.get(`/class-requests/${cls.request_id}`);
      if (res.data && res.data.data && res.data.data.applications) {
        setApplications(res.data.data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications modal:', err);
    }
  };

  const handleAssignTutor = async (requestId: string, tutorId?: string, appId?: string) => {
    try {
      const res = await axiosClient.patch(`/admin/class-requests/${requestId}/assign-tutor`, {
        tutor_id: tutorId || null,
        application_id: appId || null,
      });
      toast.success(res.data.message || 'Đã duyệt chọn gia sư cho lớp thành công!');
      setModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      console.error('Error assigning tutor:', err);
      toast.error(err.response?.data?.message || 'Có lỗi khi giao lớp cho gia sư.');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="admin-badge success">LỚP CHƯA GIAO</span>;
      case 'ASSIGNED':
        return <span className="admin-badge primary" style={{ background: '#10b981', color: '#ffffff' }}>ĐÃ GIAO</span>;
      case 'WAITING_TUTOR_CONFIRM':
        return <span className="admin-badge warning" style={{ background: '#f59e0b', color: '#ffffff' }}>CHỜ ĐÓNG PHÍ</span>;
      case 'EXPIRED':
        return <span className="admin-badge danger" style={{ background: '#ef4444', color: '#ffffff' }}>HẾT HẠN ĐÓNG PHÍ</span>;
      case 'CANCELLED':
        return <span className="admin-badge muted" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '1px solid #475569' }}>ĐÃ HỦY</span>;
      case 'REJECTED':
        return <span className="admin-badge danger" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>BỊ TỪ CHỐI</span>;
      case 'PENDING_ADMIN':
      default:
        return <span className="admin-badge danger">CHỜ DUYỆT</span>;
    }
  };

  return (
    <AdminLayout title="Quản lý Lớp Offline & Duyệt Gia Sư">
      <div className="admin-card">
        
        {/* Header Controls: Search Bar & Status Filter Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', maxWidth: '420px', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm theo Mã lớp (VD: 90414), Họ tên, SĐT, Môn học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '10px',
                border: '1px solid var(--admin-border)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--admin-text-main)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Xóa tìm kiếm"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', fontSize: '14px', marginRight: '4px' }}>
              <Filter size={16} />
              <span>Lọc trạng thái:</span>
            </div>
            {[
              { key: 'all', label: 'Tất cả lớp' },
              { key: 'PENDING_ADMIN', label: 'Chờ Admin duyệt mở' },
              { key: 'WAITING_TUTOR_CONFIRM', label: 'Chờ đóng phí' },
              { key: 'OPEN', label: 'Lớp chưa giao (OPEN)' },
              { key: 'ASSIGNED', label: 'Đã giao (ASSIGNED)' },
              { key: 'CANCELLED', label: 'Đã hủy' },
              { key: 'REJECTED', label: 'Bị từ chối' },
              { key: 'EXPIRED', label: 'Hết hạn đóng phí' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: statusFilter === tab.key ? '1px solid #6366f1' : '1px solid var(--admin-border)',
                  background: statusFilter === tab.key ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: statusFilter === tab.key ? '#818cf8' : 'var(--admin-text-muted)',
                  fontWeight: statusFilter === tab.key ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Đang tải danh sách lớp học...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Không tìm thấy lớp học nào phù hợp.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Lớp</th>
                  <th>Học viên / SĐT</th>
                  <th>Môn & Lớp</th>
                  <th>Địa chỉ</th>
                  <th>Mức lương</th>
                  <th>Phí %</th>
                  <th>Trạng thái</th>
                  <th>Ứng tuyển</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((cls) => (
                  <tr key={cls.request_id}>
                    <td>
                      <span style={{ color: '#f97316', fontWeight: 700, fontSize: '14px' }}>
                        MS: {cls.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{cls.student_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{cls.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{cls.subject_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                        {cls.grade_level ? `${cls.grade_level} • ` : ''}{cls.sessions_per_week} buổi/tuần
                      </div>
                    </td>
                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--admin-text-main)', lineHeight: '1.4' }}>
                        {cls.address_detail}
                        {cls.district ? `, ${cls.district}` : ''}
                        {cls.province ? `, ${cls.province}` : ''}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#34d399', fontSize: '14px' }}>
                        {formatCurrency(Number(cls.desired_price))}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#f87171' }}>
                        {cls.commission_rate}%
                      </span>
                    </td>
                    <td>
                      {renderStatusBadge(cls.status)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '13px' }}>
                        {cls._count?.applications || 0} đơn
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {cls.status === 'CANCELLED' ? (
                          <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                            Đã hủy (Không thể thao tác)
                          </span>
                        ) : cls.status === 'REJECTED' ? (
                          <span style={{ fontSize: '12px', color: '#f87171', fontStyle: 'italic' }}>
                            Đã từ chối
                          </span>
                        ) : (
                          <>
                            {cls.status === 'PENDING_ADMIN' && (
                              <button
                                type="button"
                                onClick={() => handleApproveOpen(cls.request_id)}
                                className="admin-btn sm success"
                                title="Duyệt mở lớp công khai"
                              >
                                <CheckCircle2 size={14} />
                                <span>Duyệt Lớp</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenApplicationsModal(cls)}
                              className="admin-btn sm primary"
                              title="Xem danh sách ứng tuyển & Duyệt Gia sư"
                            >
                              <Eye size={14} />
                              <span>Xem & Duyệt</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Xem Danh Sách Gia Sư Ứng Tuyển */}
      {modalOpen && selectedClass && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px', width: '90%', background: '#111827', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} color="#818cf8" />
                <span>Gia sư ứng tuyển Lớp MS: {selectedClass.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
              Môn dạy: <strong style={{ color: 'var(--admin-text-main)' }}>{selectedClass.subject_name}</strong> | Lớp: <strong style={{ color: 'var(--admin-text-main)' }}>{selectedClass.grade_level || 'N/A'}</strong> | Học phí: <strong style={{ color: '#34d399' }}>{formatCurrency(Number(selectedClass.desired_price))}</strong>
            </div>

            {/* Show assignment status details if assigned, waiting for fee, or expired */}
            {(selectedClass.status === 'WAITING_TUTOR_CONFIRM' || selectedClass.status === 'ASSIGNED' || selectedClass.status === 'EXPIRED') && (
              <div style={{
                background: selectedClass.status === 'ASSIGNED' ? 'rgba(16, 185, 129, 0.1)' : selectedClass.status === 'EXPIRED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${selectedClass.status === 'ASSIGNED' ? '#10b981' : selectedClass.status === 'EXPIRED' ? '#ef4444' : '#f59e0b'}`,
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--admin-text-main)'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📢 Trạng thái bàn giao lớp:</span>
                  <span style={{
                    color: selectedClass.status === 'ASSIGNED' ? '#10b981' : selectedClass.status === 'EXPIRED' ? '#f87171' : '#f59e0b',
                    fontWeight: 800
                  }}>
                    {selectedClass.status === 'ASSIGNED' ? 'ĐÃ BÀN GIAO THÀNH CÔNG' : selectedClass.status === 'EXPIRED' ? 'QUÁ HẠN ĐÓNG PHÍ' : 'ĐANG CHỜ GIA SƯ ĐÓNG PHÍ'}
                  </span>
                </div>
                <div>
                  Gia sư được giao: <strong>{selectedClass.assigned_tutor?.full_name || 'Hệ thống'}</strong>
                  {selectedClass.assigned_tutor?.phone && ` (SĐT: ${selectedClass.assigned_tutor.phone})`}
                </div>
                {selectedClass.fee_amount && (
                  <div style={{ marginTop: '4px' }}>
                    Phí nhận lớp ({selectedClass.commission_rate}%): <strong>{formatCurrency(Number(selectedClass.fee_amount))}</strong>
                  </div>
                )}
                {selectedClass.status === 'WAITING_TUTOR_CONFIRM' && selectedClass.payment_deadline && (
                  <div style={{ marginTop: '4px', color: '#f59e0b' }}>
                    Hạn thanh toán: <strong>{new Date(selectedClass.payment_deadline).toLocaleString('vi-VN')}</strong>
                  </div>
                )}
              </div>
            )}

            {applications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--admin-border)' }}>
                Chưa có gia sư nào gửi đơn đăng ký nhận lớp này.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto' }}>
                {applications.map((app) => (
                  <div
                    key={app.application_id}
                    style={{
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} color="#34d399" />
                        <span>Gia sư: {app.tutor?.full_name || 'Đăng ký nhanh'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: 500 }}>(SĐT: {app.applicant_phone})</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                        Thời gian có thể bắt đầu: <strong>{app.available_from ? new Date(app.available_from).toLocaleDateString('vi-VN') : (app.available_date || 'Ngay khi duyệt')}</strong>
                      </div>
                      {app.notes && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                          Ghi chú: {app.notes}
                        </div>
                      )}
                    </div>

                    <div>
                      {app.status === 'APPROVED' ? (
                        <span className="admin-badge success" style={{ padding: '6px 12px' }}>
                          ✓ Đã Duyệt Cho Lớp
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssignTutor(selectedClass.request_id, app.tutor?.tutor_id, app.application_id)}
                          className="admin-btn sm success"
                          style={{ fontWeight: 700 }}
                        >
                          Duyệt Gia Sư này
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="admin-btn sm secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClassRequests;
