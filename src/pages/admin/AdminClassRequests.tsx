import React, { useEffect, useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import { CheckCircle2, UserCheck, Eye, X, ClipboardList, Filter, Search, Edit3, RotateCcw, AlertTriangle, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { formatGradeLevel } from '../../utils/formatters';

interface TutorCertificate {
  cert_id: string;
  title: string;
  file_url: string;
  issued_by?: string;
  issued_date?: string;
  status: string;
}

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
    tutor_code?: string;
    full_name: string;
    avatar_url?: string;
    phone?: string;
    email?: string;
    university?: string;
    major?: string;
    current_role?: string;
    experience_years?: number;
    rating?: number;
    certificates?: TutorCertificate[];
  };
}

interface ClassRequest {
  request_id: string;
  record_type?: 'class_request' | 'offline_class';
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
  const [selectedTutorDetail, setSelectedTutorDetail] = useState<any>(null);
  const commissionRate = 35;

  // Pagination states (5 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [mainTab, statusFilter, searchQuery]);

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const paginatedRequests = requests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const refundTotalPages = Math.ceil(refundTickets.length / ITEMS_PER_PAGE);
  const paginatedRefundTickets = refundTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Process Refund Ticket State
  const [selectedTicket, setSelectedTicket] = useState<RefundTicketItem | null>(null);
  const [ticketFaultType, setTicketFaultType] = useState<'STUDENT_FAULT' | 'TUTOR_FAULT'>('STUDENT_FAULT');
  const [ticketAdminNote, setTicketAdminNote] = useState<string>('');
  const [ticketSubmitting, setTicketSubmitting] = useState<boolean>(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [editReadOnly, setEditReadOnly] = useState(false);

  // Reject Class Request State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingClass, setRejectingClass] = useState<ClassRequest | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

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
      toast.success(res.data.message || 'Đã duyệt yêu cầu bài đăng thành công!');
      fetchRequests();
    } catch (err: any) {
      console.error('Error approving open:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt mở lớp.');
    }
  };

  const handleOpenRejectModal = (cls: ClassRequest) => {
    setRejectingClass(cls);
    setRejectNote('');
    setRejectModalOpen(true);
  };

  const handleRejectClass = async () => {
    if (!rejectingClass) return;
    try {
      setRejectSubmitting(true);
      const res = await axiosClient.patch(`/admin/class-requests/${rejectingClass.request_id}/reject`, {
        admin_note: rejectNote,
      });
      toast.success(res.data.message || 'Đã từ chối bài đăng tìm gia sư thành công!');
      setRejectModalOpen(false);
      setRejectingClass(null);
      fetchRequests();
    } catch (err: any) {
      console.error('Error rejecting class:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi từ chối bài đăng.');
    } finally {
      setRejectSubmitting(false);
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

  const handleOpenEditModal = (cls: ClassRequest, readOnly = false) => {
    const isReadOnly = readOnly || cls.record_type === 'offline_class';
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
      selected_tutor_code: (cls as any).selected_tutor_code || '',
      selected_tutor: (cls as any).selected_tutor || null,
      refund_tickets: (cls as any).refund_tickets || (cls as any).refundTickets || [],
      has_pending_refund: (cls as any).has_pending_refund,
    });
    setEditReadOnly(isReadOnly);
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

  const renderStatusBadge = (cls: ClassRequest) => {
    if (cls.record_type === 'offline_class') {
      if ((cls as any).has_pending_refund || (cls.payments && (cls as any).refund_tickets?.some((t: any) => t.status === 'PENDING'))) {
        return <span className="admin-badge warning" style={{ background: '#f59e0b', color: '#ffffff' }}>CHỜ XỬ LÝ HỦY LỚP</span>;
      }
      if (cls.status === 'ACTIVE') {
        return <span className="admin-badge success" style={{ background: '#16a34a', color: '#ffffff' }}>ĐANG DẠY (ACTIVE)</span>;
      }
      if (cls.status === 'CANCELLED') {
        return <span className="admin-badge danger" style={{ background: '#fee2e2', color: '#b91c1c' }}>ĐÃ HỦY (HOÀN TIỀN)</span>;
      }
    }
    switch (cls.status) {
      case 'OPEN':
        return <span className="admin-badge success">LỚP CHƯA GIAO (OPEN)</span>;
      case 'WAITING_PAYMENT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="admin-badge warning" style={{ background: '#d97706', color: '#ffffff' }}>CHỜ ĐÓNG PHÍ ESCROW</span>
            {cls.payment_deadline && (
              <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
                Hạn: {new Date(cls.payment_deadline).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
              </span>
            )}
          </div>
        );
      case 'WAITING_TUTOR_CONFIRM':
        return <span className="admin-badge warning" style={{ background: '#0284c7', color: '#ffffff' }}>CHỜ GS CHỈ ĐỊNH XÁC NHẬN</span>;
      case 'EXPIRED': {
        const hasRefund = (cls.payments || (cls as any).payments || []).some((p: any) => p.status === 'REFUNDED');
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="admin-badge danger" style={{ background: '#dc2626', color: '#ffffff' }}>HẾT HẠN ĐÓNG PHÍ (EXPIRED)</span>
            {hasRefund && (
              <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                ✓ Đã hoàn 100% tiền giữ chỗ
              </span>
            )}
          </div>
        );
      }
      case 'CANCELLED':
        return <span className="admin-badge muted" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>ĐÃ HỦY (CANCELLED)</span>;
      case 'REJECTED':
        return <span className="admin-badge danger" style={{ background: '#fee2e2', color: '#b91c1c' }}>ADMIN TỪ CHỐI</span>;
      case 'PENDING_ADMIN':
      default:
        return <span className="admin-badge danger">CHỜ DUYỆT (PENDING)</span>;
    }
  };

  const getRequesterDisplayName = (t: any) => {
    if (!t) return 'N/A';
    const req = t.requester;
    if (req?.student_profile?.full_name) return req.student_profile.full_name;
    if (req?.tutor_profile?.full_name) {
      const code = req.tutor_profile.tutor_code ? ` (${req.tutor_profile.tutor_code})` : '';
      return `${req.tutor_profile.full_name}${code}`;
    }
    if (req?.admin_profile?.full_name) return req.admin_profile.full_name;
    if (req?.full_name) return req.full_name;
    if (t.requester_name) return t.requester_name;
    if (req?.email) return req.email;
    return t.requested_by || 'N/A';
  };

  return (
    <AdminLayout title="Quản lý Lớp Offline & Xử lý Hoàn Tiền">
      <div className="admin-card">
        
        {/* TAB CHÍNH SWITCHER */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setMainTab('requests')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: mainTab === 'requests' ? '#4f46e5' : '#f1f5f9',
              color: mainTab === 'requests' ? '#ffffff' : '#475569',
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
              background: mainTab === 'refund_tickets' ? '#dc2626' : '#f1f5f9',
              color: mainTab === 'refund_tickets' ? '#ffffff' : '#475569',
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
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Mã lớp (VD: 90414), Họ tên, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '14px', marginRight: '4px', fontWeight: 600 }}>
                  <Filter size={16} />
                  <span>Lọc trạng thái:</span>
                </div>
                {[
                  { key: 'all', label: 'Tất cả lớp' },
                  { key: 'PENDING_ADMIN', label: 'Chờ Admin duyệt' },
                  { key: 'WAITING_TUTOR_CONFIRM', label: 'Chờ GS chỉ định' },
                  { key: 'WAITING_PAYMENT', label: 'Chờ đóng phí escrow' },
                  { key: 'OPEN', label: 'Lớp chưa giao (OPEN)' },
                  { key: 'OFFLINE_ACTIVE', label: 'Đang dạy (đã giao)' },
                  { key: 'EXPIRED', label: 'Hết hạn đóng phí' },
                  { key: 'REJECTED', label: 'Admin từ chối' },
                  { key: 'CANCELLED', label: 'Đã hủy' },
                  { key: 'OFFLINE_CANCELLED', label: 'Đã hủy (hoàn tiền)' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: statusFilter === tab.key ? 'none' : '1px solid #cbd5e1',
                      background: statusFilter === tab.key ? '#4f46e5' : '#ffffff',
                      color: statusFilter === tab.key ? '#ffffff' : '#334155',
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
                    {paginatedRequests.map((cls) => (
                      <tr key={cls.request_id}>
                        <td>
                          <span style={{ color: '#f97316', fontWeight: 700, fontSize: '14px' }}>
                            MS: {cls.code}
                          </span>
                          {(cls as any).selected_tutor_code && (
                            <div style={{ marginTop: '4px', fontSize: '11px', fontWeight: 700, color: '#4338ca', background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                              🎯 GS chỉ định: {(cls as any).selected_tutor?.full_name ? `${(cls as any).selected_tutor.full_name} (${(cls as any).selected_tutor_code})` : (cls as any).selected_tutor_code}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{cls.student_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{cls.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{cls.subject_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                            {cls.grade_level ? `${formatGradeLevel(cls.grade_level)} • ` : ''}{cls.sessions_per_week} buổi/tuần
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
                          <span style={{ fontWeight: 700, color: '#059669', fontSize: '14px' }}>
                            {formatCurrency(Number(cls.desired_price))}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#dc2626' }}>
                            35%
                          </span>
                        </td>
                        <td>
                          {renderStatusBadge(cls)}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '13px' }}>
                            {cls.record_type === 'offline_class'
                              ? cls.assigned_tutor ? `GS: ${cls.assigned_tutor.full_name}` : 'Đã giao'
                              : `${cls._count?.applications || 0} đơn`}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {cls.record_type === 'offline_class' || cls.status === 'CANCELLED' || cls.status === 'EXPIRED' ? (
                              <>
                                {((cls as any).has_pending_refund || (cls.payments && (cls as any).refund_tickets?.some((t: any) => t.status === 'PENDING'))) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const pendingTicket = (cls as any).refund_tickets?.find((t: any) => t.status === 'PENDING');
                                      if (pendingTicket) {
                                        setSelectedTicket(pendingTicket);
                                        setTicketFaultType('STUDENT_FAULT');
                                      } else {
                                        setMainTab('refund_tickets');
                                      }
                                    }}
                                    className="admin-btn sm danger"
                                    style={{ background: '#dc2626', borderColor: '#dc2626' }}
                                    title="Xử lý Yêu cầu Hủy lớp & Hoàn tiền"
                                  >
                                    <AlertTriangle size={14} />
                                    <span>Duyệt Hủy</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(cls, true)}
                                  className="admin-btn sm secondary"
                                  title="Xem thông tin chi tiết lớp"
                                >
                                  <Eye size={14} />
                                  <span>Xem</span>
                                </button>
                              </>
                            ) : (
                              <>
                                {cls.status === 'PENDING_ADMIN' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleApproveOpen(cls.request_id)}
                                      className="admin-btn sm success"
                                      title={(cls as any).selected_tutor_code ? "Duyệt gửi lời mời cho Gia sư chỉ định" : "Duyệt mở lớp công khai (OPEN)"}
                                    >
                                      <CheckCircle2 size={14} />
                                      <span>{(cls as any).selected_tutor_code ? "Duyệt Lời Mời" : "Duyệt Lớp"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenRejectModal(cls)}
                                      className="admin-btn sm danger"
                                      style={{ background: '#ef4444', borderColor: '#ef4444' }}
                                      title="Từ chối bài đăng tìm gia sư"
                                    >
                                      <X size={14} />
                                      <span>Từ Chối</span>
                                    </button>
                                  </>
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
                                  onClick={() => handleOpenEditModal(cls, false)}
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

            {/* PAGINATION CONTROLS FOR CLASS REQUESTS */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    color: currentPage === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text-main)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ChevronLeft size={16} /> Trang trước
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: page === currentPage ? 'none' : '1px solid var(--admin-border)',
                      background: page === currentPage ? '#6366f1' : 'rgba(255,255,255,0.04)',
                      color: page === currentPage ? '#ffffff' : 'var(--admin-text-main)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    color: currentPage === totalPages ? 'var(--admin-text-muted)' : 'var(--admin-text-main)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Trang sau <ChevronRight size={16} />
                </button>
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
                    {paginatedRefundTickets.map((t) => (
                      <tr key={t.ticket_id}>
                        <td>
                          <span style={{ color: '#f97316', fontWeight: 700 }}>
                            MS: {t.offline_class?.class_offline_code || t.class_id.slice(0, 8)}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{getRequesterDisplayName(t)}</div>
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

            {/* PAGINATION CONTROLS FOR REFUND TICKETS */}
            {refundTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    color: currentPage === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text-main)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ChevronLeft size={16} /> Trang trước
                </button>

                {Array.from({ length: refundTotalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: page === currentPage ? 'none' : '1px solid var(--admin-border)',
                      background: page === currentPage ? '#dc2626' : 'rgba(255,255,255,0.04)',
                      color: page === currentPage ? '#ffffff' : 'var(--admin-text-main)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === refundTotalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, refundTotalPages))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)',
                    background: currentPage === refundTotalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    color: currentPage === refundTotalPages ? 'var(--admin-text-muted)' : 'var(--admin-text-main)',
                    cursor: currentPage === refundTotalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Trang sau <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Xử lý Refund Ticket */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '560px', width: '92%', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} />
                <span>Xử lý Yêu cầu Hoàn tiền 7 ngày</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: '#0f172a', marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', lineHeight: '1.6' }}>
              <strong>Mã lớp:</strong> MS: {selectedTicket.offline_class?.class_offline_code || selectedTicket.class_id.slice(0, 8)}
              <br />
              <strong>Lý do gửi:</strong> {selectedTicket.reason}
              <br />
              <strong>Học phí HV đã đóng:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>{formatCurrency(Number(selectedTicket.student_tuition_amount))}</span> | <strong>Phí GS đã đóng:</strong> <span style={{ color: '#dc2626', fontWeight: 700 }}>{formatCurrency(Number(selectedTicket.tutor_fee_amount))}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px', fontSize: '14px' }}>
                Chọn Bên Gây Lỗi (Fault Type) *
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ flex: 1, padding: '12px', borderRadius: '8px', border: ticketFaultType === 'STUDENT_FAULT' ? '2px solid #f59e0b' : '1px solid #cbd5e1', background: ticketFaultType === 'STUDENT_FAULT' ? '#fffbeb' : '#ffffff', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                  <input
                    type="radio"
                    name="fault_type"
                    value="STUDENT_FAULT"
                    checked={ticketFaultType === 'STUDENT_FAULT'}
                    onChange={() => setTicketFaultType('STUDENT_FAULT')}
                    style={{ marginRight: '6px' }}
                  />
                  <strong style={{ color: '#d97706' }}>STUDENT_FAULT (Lỗi Học viên)</strong>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', lineHeight: '1.4' }}>
                    • Học viên bị phạt 10% ({formatCurrency(Number(selectedTicket.student_tuition_amount) * 0.1)}), hoàn 90%.
                    <br />
                    • Gia sư hoàn 100% phí ({formatCurrency(Number(selectedTicket.tutor_fee_amount))}).
                  </div>
                </label>

                <label style={{ flex: 1, padding: '12px', borderRadius: '8px', border: ticketFaultType === 'TUTOR_FAULT' ? '2px solid #ef4444' : '1px solid #cbd5e1', background: ticketFaultType === 'TUTOR_FAULT' ? '#fef2f2' : '#ffffff', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                  <input
                    type="radio"
                    name="fault_type"
                    value="TUTOR_FAULT"
                    checked={ticketFaultType === 'TUTOR_FAULT'}
                    onChange={() => setTicketFaultType('TUTOR_FAULT')}
                    style={{ marginRight: '6px' }}
                  />
                  <strong style={{ color: '#dc2626' }}>TUTOR_FAULT (Lỗi Gia sư)</strong>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', lineHeight: '1.4' }}>
                    • Gia sư bị phạt 20% ({formatCurrency(Number(selectedTicket.tutor_fee_amount) * 0.2)}), hoàn 80%.
                    <br />
                    • Học viên hoàn 100% học phí ({formatCurrency(Number(selectedTicket.student_tuition_amount))}).
                  </div>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '13px' }}>
                Ghi chú căn cứ kết luận của Admin
              </label>
              <textarea
                rows={3}
                value={ticketAdminNote}
                onChange={(e) => setTicketAdminNote(e.target.value)}
                placeholder="Nhập lý do kết luận căn cứ phạt/hoàn tiền..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={ticketSubmitting}
                onClick={() => handleProcessRefundTicket('REJECTED')}
                className="admin-btn secondary"
              >
                Từ chối Ticket
              </button>

              <button
                type="button"
                disabled={ticketSubmitting}
                onClick={() => handleProcessRefundTicket('APPROVED')}
                className="admin-btn danger"
                style={{ background: '#dc2626', color: '#ffffff', fontWeight: 700, padding: '8px 20px' }}
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
          <div className="modal-card" style={{ maxWidth: '680px', width: '90%', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={20} color="#4f46e5" />
                <span>Gia sư ứng tuyển Lớp MS: {selectedClass.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {applications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                Chưa có gia sư nào gửi đơn đăng ký nhận lớp này.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto' }}>
                {([...applications].sort((a: any, b: any) => {
                  if (a.status === 'APPROVED' && b.status !== 'APPROVED') return -1;
                  if (b.status === 'APPROVED' && a.status !== 'APPROVED') return 1;
                  if (a.status === 'PENDING' && b.status === 'PENDING') {
                    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                  }
                  return 0;
                })).map((app) => {
                  const isReturningApplicant =
                    selectedClass?.status === 'OPEN' &&
                    app.status === 'PENDING' &&
                    (Date.now() - new Date(app.created_at).getTime()) > 60 * 60 * 1000;

                  return (
                    <div
                      key={app.application_id}
                      style={{
                        border: isReturningApplicant ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '14px',
                        background: isReturningApplicant ? '#fffdf5' : '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <UserCheck size={16} color="#16a34a" />
                          <span>Gia sư: {app.tutor?.full_name || 'Đăng ký nhanh'}</span>
                          {isReturningApplicant && (
                            <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: 600 }}>
                              ⏳ Đã ứng tuyển trước
                            </span>
                          )}
                        </div>
                      {app.tutor?.university && (
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginLeft: '24px' }}>
                          Trường: {app.tutor.university} {app.tutor.major ? `• Ngành: ${app.tutor.major}` : ''}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {app.tutor && (
                        <button
                          type="button"
                          onClick={() => setSelectedTutorDetail({ ...app.tutor, applicant_phone: app.applicant_phone || app.tutor?.phone, application_id: app.application_id, status: app.status })}
                          className="admin-btn sm secondary"
                          title="Xem thông tin chi tiết bằng cấp và hồ sơ gia sư"
                        >
                          <Eye size={14} />
                          <span>Xem Bằng Cấp</span>
                        </button>
                      )}

                      {app.status === 'APPROVED' ? (
                        <span className="admin-badge success" style={{ padding: '6px 12px' }}>
                          ✓ Đã Duyệt Cho Lớp
                        </span>
                      ) : app.status === 'APPROVED_WAITING_FEE' ? (
                        <span className="admin-badge warning" style={{ padding: '6px 12px' }}>
                          ⏳ Chờ Đóng Phí Escrow
                        </span>
                      ) : app.status === 'EXPIRED' ? (
                        <span className="admin-badge warning" style={{ padding: '6px 12px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                          ⏱ Hết Hạn Đóng Phí
                        </span>
                      ) : app.status === 'REJECTED' ? (
                        <span className="admin-badge danger" style={{ padding: '6px 12px' }}>
                          ✕ Đã Từ Chối
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
                );
              })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Xem Chi Tiết Hồ Sơ & Bằng Cấp Gia Sư */}
      {selectedTutorDetail && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-card" style={{ maxWidth: '720px', width: '92%', background: '#ffffff', border: '1px solid #cbd5e1', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={22} color="#4f46e5" />
                <span>Hồ sơ & Bằng cấp Gia sư: {selectedTutorDetail.full_name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTutorDetail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Thông tin cá nhân & Học vấn */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', marginBottom: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '12px' }}>
              {selectedTutorDetail.avatar_url ? (
                <img src={selectedTutorDetail.avatar_url} alt="Avatar" style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }} />
              ) : (
                <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color: '#4338ca', border: '2px solid #c7d2fe' }}>
                  {selectedTutorDetail.full_name?.charAt(0) || 'G'}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Mã gia sư:</strong> <span style={{ color: '#4f46e5', fontWeight: 800, background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>{selectedTutorDetail.tutor_code || 'Chưa cấp'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Số điện thoại:</strong> <span style={{ color: '#16a34a', fontWeight: 800 }}>{selectedTutorDetail.applicant_phone || selectedTutorDetail.phone || 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Email:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedTutorDetail.email || 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Trường ĐH:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedTutorDetail.university || 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Chuyên ngành:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedTutorDetail.major || 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Chức vụ:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedTutorDetail.current_role || 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Kinh nghiệm:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedTutorDetail.experience_years ? `${selectedTutorDetail.experience_years} năm` : 'Chưa cập nhật'}</span></div>
                <div><strong style={{ color: '#475569', fontWeight: 600 }}>Đánh giá:</strong> <span style={{ color: '#d97706', fontWeight: 800 }}>{selectedTutorDetail.rating ? `⭐ ${selectedTutorDetail.rating}` : 'Chưa có đánh giá'}</span></div>
              </div>
            </div>

            {/* Danh sách Bằng cấp / Chứng chỉ */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#4338ca', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={18} color="#4338ca" />
                <span>Danh sách Bằng cấp & Chứng chỉ đính kèm ({selectedTutorDetail.certificates?.length || 0})</span>
              </h4>
              {!selectedTutorDetail.certificates || selectedTutorDetail.certificates.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', fontSize: '13px' }}>
                  Gia sư chưa tải lên bằng cấp hoặc chứng chỉ nào.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {selectedTutorDetail.certificates.map((cert: any) => (
                    <div key={cert.cert_id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc', transition: 'all 0.15s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '6px' }}>{cert.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>Nơi cấp: <span style={{ color: '#0f172a', fontWeight: 600 }}>{cert.issued_by || 'Chưa rõ'}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`admin-badge ${cert.status === 'approved' ? 'success' : cert.status === 'rejected' ? 'danger' : 'warning'}`} style={{ fontSize: '11px', fontWeight: 800 }}>
                          {cert.status === 'approved' ? 'ĐÃ DUYỆT' : cert.status === 'rejected' ? 'TỪ CHỐI' : 'CHỜ DUYỆT'}
                        </span>
                        {cert.file_url && (
                          <a href={cert.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                            Xem file scan ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setSelectedTutorDetail(null)}
                style={{ padding: '8px 18px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Đóng
              </button>
              {selectedClass && (
                selectedTutorDetail.status === 'APPROVED' ? (
                  <span className="admin-badge success" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    ✓ Đã Duyệt Cho Lớp
                  </span>
                ) : selectedTutorDetail.status === 'EXPIRED' ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="admin-badge warning" style={{ padding: '8px 16px', fontSize: '13px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                      ⏱ Hết Hạn Đóng Phí
                    </span>
                    {selectedClass.status === 'OPEN' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Gia sư ${selectedTutorDetail.full_name} đã từng HẾT HẠN đóng phí. Bạn có chắc chắn muốn GIAO LẠI LỚP cho gia sư này không?`)) {
                            handleAssignTutor(selectedClass.request_id, selectedTutorDetail.tutor_id, selectedTutorDetail.application_id);
                            setSelectedTutorDetail(null);
                          }
                        }}
                        className="admin-btn secondary"
                        style={{ fontWeight: 700, padding: '8px 20px', color: '#d97706', borderColor: '#d97706' }}
                      >
                        Giao Lại Lớp
                      </button>
                    )}
                  </div>
                ) : selectedTutorDetail.status === 'REJECTED' ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="admin-badge danger" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      ✕ Đã Từ Chối
                    </span>
                    {selectedClass.status === 'OPEN' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Đơn của gia sư ${selectedTutorDetail.full_name} đã từng BỊ TỪ CHỐI. Bạn có chắc chắn muốn GIAO LẠI LỚP cho gia sư này không?`)) {
                            handleAssignTutor(selectedClass.request_id, selectedTutorDetail.tutor_id, selectedTutorDetail.application_id);
                            setSelectedTutorDetail(null);
                          }
                        }}
                        className="admin-btn secondary"
                        style={{ fontWeight: 700, padding: '8px 20px', color: '#dc2626', borderColor: '#dc2626' }}
                      >
                        Giao Lại Lớp
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleAssignTutor(selectedClass.request_id, selectedTutorDetail.tutor_id, selectedTutorDetail.application_id);
                      setSelectedTutorDetail(null);
                    }}
                    className="admin-btn success"
                    style={{ fontWeight: 800, padding: '8px 22px', background: '#16a34a', color: '#ffffff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    Giao Lớp cho Gia Sư này
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Class Request */}
      {editModalOpen && editFormData && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '780px', width: '92%', background: '#ffffff', border: '1px solid #cbd5e1', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editReadOnly ? <Eye size={20} color="#4f46e5" /> : <Edit3 size={20} color="#4f46e5" />}
                <span>{editReadOnly ? `Xem thông tin Lớp Offline MS: ${editFormData.code}` : `Chỉnh sửa Lớp Offline MS: ${editFormData.code}`}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Cảnh báo Ticket Hủy Lớp nếu có */}
              {editFormData.refund_tickets && editFormData.refund_tickets.length > 0 && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: '#dc2626', margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#dc2626" />
                    Thông Tin Yêu Cầu Hủy Lớp & Hoàn Tiền (7 Ngày)
                  </h4>
                  {editFormData.refund_tickets.map((t: any) => (
                    <div key={t.ticket_id || t.created_at} style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', color: '#7f1d1d', lineHeight: '1.5' }}>
                      <div>• <strong>Người gửi yêu cầu:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{getRequesterDisplayName(t)}</span> ({t.requester?.role === 'tutor' ? 'Gia sư' : 'Học viên'})</div>
                      <div>• <strong>Thời gian gửi:</strong> <span style={{ color: '#0f172a' }}>{new Date(t.requested_at || t.created_at).toLocaleString('vi-VN')}</span></div>
                      <div>• <strong>Lý do hủy lớp:</strong> <span style={{ color: '#0f172a', fontStyle: 'italic', fontWeight: 600 }}>"{t.reason}"</span></div>
                      <div>• <strong>Trạng thái ticket:</strong> <span style={{ fontWeight: 700, color: t.status === 'PENDING' ? '#d97706' : t.status === 'COMPLETED' ? '#16a34a' : '#dc2626' }}>{t.status === 'PENDING' ? '⏳ ĐANG CHỜ ADMIN XỬ LÝ' : t.status}</span></div>
                      
                      {t.status === 'PENDING' && (
                        <div style={{ marginTop: '10px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditModalOpen(false);
                              setSelectedTicket(t);
                              setTicketFaultType('STUDENT_FAULT');
                            }}
                            style={{
                              background: '#dc2626',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <AlertTriangle size={15} />
                            Xử lý Duyệt Hủy & Hoàn tiền ngay
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Họ tên học viên *
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={editFormData.student_name}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Điện thoại liên hệ *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Môn học *
                  </label>
                  <input
                    type="text"
                    name="subject_name"
                    value={editFormData.subject_name}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Lớp / Trình độ
                  </label>
                  <input
                    type="text"
                    name="grade_level"
                    value={editFormData.grade_level}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    placeholder="VD: Lớp 1, Lớp 10..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Số lượng học viên
                  </label>
                  <input
                    type="number"
                    name="num_students"
                    value={editFormData.num_students}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    min={1}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Học lực học viên
                  </label>
                  <input
                    type="text"
                    name="academic_level"
                    value={editFormData.academic_level}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    placeholder="VD: Trung bình, Khá, Giỏi..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Số buổi / tuần
                  </label>
                  <input
                    type="number"
                    name="sessions_per_week"
                    value={editFormData.sessions_per_week}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    min={1}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Thời gian học
                  </label>
                  <input
                    type="text"
                    name="study_time"
                    value={editFormData.study_time}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    placeholder="VD: Tối Thứ 2, 4, 6"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Yêu cầu Gia sư
                  </label>
                  <input
                    type="text"
                    name="tutor_requirement"
                    value={editFormData.tutor_requirement}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    placeholder="VD: Sinh viên, Giáo viên, Cử nhân..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Mức lương mong muốn (VNĐ/tháng)
                  </label>
                  <input
                    type="number"
                    name="desired_price"
                    value={editFormData.desired_price}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    step={50000}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Địa chỉ chi tiết (Số nhà, đường...)
                  </label>
                  <input
                    type="text"
                    name="address_detail"
                    value={editFormData.address_detail}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={editFormData.district}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={editFormData.province}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Yêu cầu khác
                  </label>
                  <textarea
                    name="other_requirements"
                    value={editFormData.other_requirements}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    rows={3}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                    Trạng thái Lớp *
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    disabled={editReadOnly}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="PENDING_ADMIN">CHỜ ADMIN DUYỆT (PENDING_ADMIN)</option>
                    <option value="OPEN">LỚP CHƯA GIAO / CÔNG KHAI (OPEN)</option>
                    <option value="WAITING_PAYMENT">CHỜ ĐÓNG PHÍ ESCROW (WAITING_PAYMENT)</option>
                    <option value="CANCELLED">ĐÃ HỦY (CANCELLED)</option>
                    <option value="EXPIRED">HẾT HẠN ĐÓNG PHÍ (EXPIRED)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {editReadOnly ? (
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="admin-btn sm secondary"
                  >
                    Đóng
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Từ Chối Bài Đăng Tìm Gia Sư */}
      {rejectModalOpen && rejectingClass && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px', width: '90%', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} />
                <span>Từ Chối Bài Đăng Tìm Gia Sư</span>
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: '#0f172a', marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
              <strong>Mã lớp:</strong> MS: {rejectingClass.code}
              <br />
              <strong>Học viên:</strong> {rejectingClass.student_name} ({rejectingClass.phone})
              <br />
              <strong>Môn & Lớp:</strong> {rejectingClass.subject_name}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '13px' }}>
                Lý do từ chối bài đăng *
              </label>
              <textarea
                rows={3}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Nhập ghi chú lý do từ chối (VD: Thông tin địa chỉ không rõ ràng, yêu cầu không phù hợp...)"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={rejectSubmitting}
                onClick={() => setRejectModalOpen(false)}
                className="admin-btn sm secondary"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={rejectSubmitting}
                onClick={handleRejectClass}
                className="admin-btn sm danger"
                style={{ background: '#ef4444', borderColor: '#ef4444', fontWeight: 700 }}
              >
                {rejectSubmitting ? 'Đang từ chối...' : 'Xác Nhận Từ Chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminClassRequests;

