import React, { useEffect, useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { CheckCircle2, UserCheck, Eye, X, ClipboardList, Filter, Search, Edit3, RotateCcw, AlertTriangle } from 'lucide-react';

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
  payments?: any[];
  _count?: { applications: number };
}

interface RefundTicketItem {
  ticket_id: string;
  class_id: string;
  reason: string;
  fault_type?: string;
  admin_note?: string;
  status: string;
  student_tuition_amount: number;
  student_penalty_amount: number;
  student_refund_amount: number;
  tutor_fee_amount: number;
  tutor_penalty_amount: number;
  tutor_refund_amount: number;
  requested_at: string;
  processed_at?: string;
  offline_class?: any;
  requester?: { email: string; role: string };
}

const AdminClassRequests: React.FC = () => {
  const [mainTab, setMainTab] = useState<'requests' | 'refund_tickets'>('requests');
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [refundTickets, setRefundTickets] = useState<RefundTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedClass, setSelectedClass] = useState<ClassRequest | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const commissionRate = 35;

  // Process Refund Ticket State
  const [selectedTicket, setSelectedTicket] = useState<RefundTicketItem | null>(null);
  const [ticketFaultType, setTicketFaultType] = useState<'STUDENT_FAULT' | 'TUTOR_FAULT'>('STUDENT_FAULT');
  const [ticketAdminNote, setTicketAdminNote] = useState<string>('');
  const [ticketSubmitting, setTicketSubmitting] = useState<boolean>(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

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

  const fetchRefundTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/refund-tickets');
      if (res.data && res.data.data) {
        setRefundTickets(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching refund tickets:', err);
      toast.error('Lỗi khi lấy danh sách ticket hoàn tiền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'requests') {
      const timer = setTimeout(() => { fetchRequests(); }, 300);
      return () => clearTimeout(timer);
    } else {
      fetchRefundTickets();
    }
  }, [mainTab, statusFilter, searchQuery]);

  const handleApproveOpen = async (requestId: string) => {
    try {
      const res = await axiosClient.patch(`/admin/class-requests/${requestId}/approve-open`, {
        commission_rate: commissionRate,
      });
      toast.success(res.data.message || 'Đã duyệt mở lớp công khai (OPEN) thành công!');
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
      toast.success(res.data.message || 'Đã duyệt giao lớp! Hệ thống tạo nghĩa vụ nộp học phí và phí nhận lớp escrow.');
      setModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      console.error('Error assigning tutor:', err);
      toast.error(err.response?.data?.message || 'Có lỗi khi giao lớp cho gia sư.');
    }
  };

  const handleProcessRefundTicket = async (statusAction: 'APPROVED' | 'REJECTED') => {
    if (!selectedTicket) return;
    try {
      setTicketSubmitting(true);
      const res = await axiosClient.patch(`/admin/refund-tickets/${selectedTicket.ticket_id}/process`, {
        status: statusAction,
        fault_type: ticketFaultType,
        admin_note: ticketAdminNote,
      });
      toast.success(res.data.message || 'Đã xử lý ticket hủy lớp thành công!');
      setSelectedTicket(null);
      setTicketAdminNote('');
      fetchRefundTickets();
    } catch (err: any) {
      console.error('Error processing refund ticket:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi xử lý ticket.');
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleOpenEditModal = (cls: ClassRequest) => {
    setEditFormData({
      request_id: cls.request_id,
      code: cls.code,
      student_name: cls.student_name || '',
      phone: cls.phone || '',
      email: (cls as any).email || '',
      address_detail: cls.address_detail || '',
      district: cls.district || '',
      province: cls.province || 'Hồ Chí Minh',
      grade_level: cls.grade_level || 'Lớp 1',
      subject_name: cls.subject_name || '',
      num_students: (cls as any).num_students || 1,
      academic_level: (cls as any).academic_level || '',
      sessions_per_week: cls.sessions_per_week || 2,
      study_time: cls.study_time || '',
      tutor_requirement: cls.tutor_requirement || 'Sinh viên',
      desired_price: cls.desired_price || 0,
      commission_rate: cls.commission_rate || 35,
      other_requirements: (cls as any).other_requirements || '',
      status: cls.status || 'PENDING_ADMIN',
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    try {
      const res = await axiosClient.put(`/admin/class-requests/${editFormData.request_id}`, editFormData);
      toast.success(res.data.message || 'Cập nhật thông tin lớp học thành công!');
      setEditModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      console.error('Error updating class request:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin lớp.');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="admin-badge success">LỚP CHƯA GIAO (OPEN)</span>;
      case 'WAITING_PAYMENT':
        return <span className="admin-badge warning" style={{ background: '#f59e0b', color: '#ffffff' }}>CHỜ ĐÓNG PHÍ ESCROW</span>;
      case 'EXPIRED':
        return <span className="admin-badge danger" style={{ background: '#ef4444', color: '#ffffff' }}>HẾT HẠN ĐÓNG PHÍ (EXPIRED)</span>;
      case 'CANCELLED':
        return <span className="admin-badge muted" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '1px solid #475569' }}>ĐÃ HỦY (CANCELLED)</span>;
      case 'REJECTED':
        return <span className="admin-badge danger" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>ADMIN TỪ CHỐI</span>;
      case 'PENDING_ADMIN':
      default:
        return <span className="admin-badge danger">CHỜ DUYỆT (PENDING)</span>;
    }
  };

  return (
    <AdminLayout title="Quản lý Lớp Offline & Xử lý Hoàn Tiền">
      <div className="admin-card">
        
        {/* TAB CHÍNH SWITCHER */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setMainTab('requests')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: mainTab === 'requests' ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
              color: mainTab === 'requests' ? '#ffffff' : 'var(--admin-text-muted)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ClipboardList size={18} />
            Quản lý Bài đăng & Giao Lớp ({requests.length})
          </button>

          <button
            type="button"
            onClick={() => setMainTab('refund_tickets')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: mainTab === 'refund_tickets' ? '#dc2626' : 'rgba(255, 255, 255, 0.04)',
              color: mainTab === 'refund_tickets' ? '#ffffff' : 'var(--admin-text-muted)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={18} />
            Xử lý Yêu cầu Hoàn tiền 7 ngày ({refundTickets.filter(t => t.status === 'PENDING').length} chờ)
          </button>
        </div>

        {mainTab === 'requests' ? (
          <>
            {/* Controls: Search Bar & Status Filter Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div style={{ position: 'relative', maxWidth: '420px', width: '100%' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Mã lớp (VD: 90414), Họ tên, SĐT..."
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
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', fontSize: '14px', marginRight: '4px' }}>
                  <Filter size={16} />
                  <span>Lọc trạng thái:</span>
                </div>
                {[
                  { key: 'all', label: 'Tất cả lớp' },
                  { key: 'PENDING_ADMIN', label: 'Chờ Admin duyệt' },
                  { key: 'WAITING_PAYMENT', label: 'Chờ đóng phí escrow' },
                  { key: 'OPEN', label: 'Lớp chưa giao (OPEN)' },
                  { key: 'EXPIRED', label: 'Hết hạn đóng phí' },
                  { key: 'CANCELLED', label: 'Đã hủy' },
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
                            35%
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
                            {cls.status === 'CANCELLED' || cls.status === 'EXPIRED' ? (
                              <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                                Đã kết thúc
                              </span>
                            ) : (
                              <>
                                {cls.status === 'PENDING_ADMIN' && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOpen(cls.request_id)}
                                    className="admin-btn sm success"
                                    title="Duyệt mở lớp công khai (OPEN)"
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
                                  <span>Giao Lớp</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(cls)}
                                  className="admin-btn sm secondary"
                                  title="Chỉnh sửa thông tin lớp"
                                >
                                  <Edit3 size={14} />
                                  <span>Sửa</span>
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
          </>
        ) : (
          /* TAB 2: QUẢN LÝ TICKET HOÀN TIỀN 7 NGÀY */
          <div>
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                Đang tải danh sách ticket hoàn tiền...
              </div>
            ) : refundTickets.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                Hiện không có yêu cầu hủy lớp / hoàn tiền nào.
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã Lớp</th>
                      <th>Người Yêu Cầu</th>
                      <th>Lý Do Sự Cố</th>
                      <th>Học Phí HV</th>
                      <th>Phí GS</th>
                      <th>Trạng Thái</th>
                      <th>Kết Luận Lỗi</th>
                      <th style={{ textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundTickets.map((t) => (
                      <tr key={t.ticket_id}>
                        <td>
                          <span style={{ color: '#f97316', fontWeight: 700 }}>
                            MS: {t.offline_class?.class_offline_code || t.class_id.slice(0, 8)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.requester?.email || 'N/A'}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(t.requested_at).toLocaleString('vi-VN')}</div>
                        </td>
                        <td style={{ maxWidth: '240px', fontSize: '13px' }}>
                          {t.reason}
                        </td>
                        <td style={{ color: '#34d399', fontWeight: 700 }}>
                          {formatCurrency(Number(t.student_tuition_amount))}
                        </td>
                        <td style={{ color: '#f87171', fontWeight: 700 }}>
                          {formatCurrency(Number(t.tutor_fee_amount))}
                        </td>
                        <td>
                          {t.status === 'COMPLETED' ? (
                            <span className="admin-badge success">ĐÃ HOÀN TẤT</span>
                          ) : t.status === 'REJECTED' ? (
                            <span className="admin-badge danger">TỪ CHỐI</span>
                          ) : (
                            <span className="admin-badge warning">CHỜ XỬ LÝ</span>
                          )}
                        </td>
                        <td>
                          {t.fault_type === 'STUDENT_FAULT' ? (
                            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>Lỗi Học viên (10%/90%)</span>
                          ) : t.fault_type === 'TUTOR_FAULT' ? (
                            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '12px' }}>Lỗi Gia sư (20%/80%)</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>Chưa chốt</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {t.status === 'PENDING' ? (
                            <button
                              type="button"
                              onClick={() => { setSelectedTicket(t); setTicketFaultType('STUDENT_FAULT'); }}
                              className="admin-btn sm primary"
                              style={{ background: '#dc2626', borderColor: '#dc2626' }}
                            >
                              <AlertTriangle size={14} />
                              <span>Xử lý Hoàn tiền</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Đã xong</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Xử lý Refund Ticket */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '560px', width: '92%', background: '#111827', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} />
                <span>Xử lý Yêu cầu Hoàn tiền 7 ngày</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--admin-text-main)', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>Mã lớp:</strong> MS: {selectedTicket.offline_class?.class_offline_code || selectedTicket.class_id.slice(0, 8)}
              <br />
              <strong>Lý do gửi:</strong> {selectedTicket.reason}
              <br />
              <strong>Học phí HV đã đóng:</strong> {formatCurrency(Number(selectedTicket.student_tuition_amount))} | <strong>Phí GS đã đóng:</strong> {formatCurrency(Number(selectedTicket.tutor_fee_amount))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, color: 'var(--admin-text-main)', marginBottom: '6px', fontSize: '14px' }}>
                Chọn Bên Gây Lỗi (Fault Type) *
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ flex: 1, padding: '10px', borderRadius: '8px', border: ticketFaultType === 'STUDENT_FAULT' ? '2px solid #f59e0b' : '1px solid var(--admin-border)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="fault_type"
                    value="STUDENT_FAULT"
                    checked={ticketFaultType === 'STUDENT_FAULT'}
                    onChange={() => setTicketFaultType('STUDENT_FAULT')}
                    style={{ marginRight: '6px' }}
                  />
                  <strong style={{ color: '#f59e0b' }}>STUDENT_FAULT (Lỗi Học viên)</strong>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                    • Học viên bị phạt 10% ({formatCurrency(Number(selectedTicket.student_tuition_amount) * 0.1)}), hoàn 90%.
                    <br />
                    • Gia sư hoàn 100% phí ({formatCurrency(Number(selectedTicket.tutor_fee_amount))}).
                  </div>
                </label>

                <label style={{ flex: 1, padding: '10px', borderRadius: '8px', border: ticketFaultType === 'TUTOR_FAULT' ? '2px solid #ef4444' : '1px solid var(--admin-border)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="fault_type"
                    value="TUTOR_FAULT"
                    checked={ticketFaultType === 'TUTOR_FAULT'}
                    onChange={() => setTicketFaultType('TUTOR_FAULT')}
                    style={{ marginRight: '6px' }}
                  />
                  <strong style={{ color: '#ef4444' }}>TUTOR_FAULT (Lỗi Gia sư)</strong>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                    • Gia sư bị phạt 20% ({formatCurrency(Number(selectedTicket.tutor_fee_amount) * 0.2)}), hoàn 80%.
                    <br />
                    • Học viên hoàn 100% học phí ({formatCurrency(Number(selectedTicket.student_tuition_amount))}).
                  </div>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '6px', fontSize: '13px' }}>
                Ghi chú căn cứ kết luận của Admin
              </label>
              <textarea
                rows={3}
                value={ticketAdminNote}
                onChange={(e) => setTicketAdminNote(e.target.value)}
                placeholder="Nhập lý do kết luận căn cứ phạt/hoàn tiền..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--admin-text-main)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={ticketSubmitting}
                onClick={() => handleProcessRefundTicket('REJECTED')}
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', color: 'var(--admin-text-main)', border: '1px solid var(--admin-border)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                Từ chối Ticket
              </button>

              <button
                type="button"
                disabled={ticketSubmitting}
                onClick={() => handleProcessRefundTicket('APPROVED')}
                style={{ padding: '8px 20px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: ticketSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {ticketSubmitting ? 'Đang xử lý...' : 'Chốt Hoàn Tiền & Hủy Lớp'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                          Giao Lớp cho Gia Sư này
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Edit Class Request */}
      {editModalOpen && editFormData && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '780px', width: '92%', background: '#111827', border: '1px solid var(--admin-border)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#818cf8" />
                <span>Chỉnh sửa Lớp Offline MS: {editFormData.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '4px' }}>
                    Họ tên học viên *
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={editFormData.student_name}
                    onChange={handleEditFormChange}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--admin-text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '4px' }}>
                    Điện thoại liên hệ *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--admin-text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '4px' }}>
                    Trạng thái Lớp *
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--admin-border)', background: '#1f2937', color: 'var(--admin-text-main)', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="PENDING_ADMIN">CHỜ ADMIM DUYỆT (PENDING_ADMIN)</option>
                    <option value="OPEN">LỚP CHƯA GIAO / CÔNG KHAI (OPEN)</option>
                    <option value="WAITING_PAYMENT">CHỜ ĐÓNG PHÍ ESCROW (WAITING_PAYMENT)</option>
                    <option value="CANCELLED">ĐÃ HỦY (CANCELLED)</option>
                    <option value="EXPIRED">HẾT HẠN ĐÓNG PHÍ (EXPIRED)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="admin-btn sm secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="admin-btn sm primary"
                  style={{ fontWeight: 700, padding: '8px 20px' }}
                >
                  Lưu thay đổi lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClassRequests;
