import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  BookOpen, 
  UserCheck, 
  Edit3, 
  XCircle, 
  AlertCircle, 
  Calendar,
  Check,
  CreditCard,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import { formatGradeLevel } from '../../../utils/formatters';
import { EditClassRequestModal } from '../modals/EditClassRequestModal';

export interface StudentClassRequest {
  request_id?: string;
  class_id?: string;
  code?: string;
  class_code?: string;
  student_name: string;
  phone: string;
  email?: string | null;
  address_detail: string;
  district?: string | null;
  province?: string | null;
  grade_level?: string;
  subject_name: string;
  num_students: number;
  academic_level?: string | null;
  sessions_per_week: number;
  study_time?: string | null;
  tutor_requirement?: string | null;
  desired_price: number;
  commission_rate?: number;
  status: string;
  created_at: string;
  is_active_offline_class?: boolean;
  tutor_name?: string;
  tutor_phone?: string;
  selected_tutor_code?: string | null;
  selected_tutor?: { full_name: string; phone?: string | null; avatar_url?: string | null } | null;
  assigned_tutor?: { full_name: string; phone?: string | null; avatar_url?: string | null } | null;
  payment_deadline?: string;
  refund_deadline?: string;
  payments?: any[];
  refund_tickets?: any[];
  _count?: { applications: number };
}

interface ClassRequestsTabProps {
  classRequests: StudentClassRequest[];
  onRefresh: () => void;
}

const PaymentCountdown: React.FC<{ deadline?: string }> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean } | null>(null);

  useEffect(() => {
    if (!deadline) return;

    const calc = () => {
      const target = new Date(deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) {
    return (
      <div style={{ color: '#b45309', fontWeight: 600, fontSize: '0.82rem', marginTop: '4px' }}>
        ⏳ Thời hạn nộp học phí: 24 giờ kể từ khi được xếp gia sư
      </div>
    );
  }

  if (!timeLeft) return null;

  if (timeLeft.isExpired) {
    return (
      <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.84rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>⚠️ Đã hết hạn nộp học phí! Lớp yêu cầu sẽ bị chuyển về trạng thái trễ hạn.</span>
      </div>
    );
  }

  const formattedDeadlineStr = new Date(deadline).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });

  return (
    <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 10px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
      <span style={{ color: '#92400e', fontWeight: 700, fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={14} color="#d97706" />
        Thời hạn nộp học phí còn:
      </span>
      <span style={{ background: '#d97706', color: '#ffffff', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem', padding: '2px 8px', borderRadius: '6px' }}>
        {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
      </span>
      <span style={{ color: '#78350f', fontSize: '0.75rem', width: '100%', textAlign: 'right' }}>
        (Hạn chót: {formattedDeadlineStr})
      </span>
    </div>
  );
};

export const ClassRequestsTab: React.FC<ClassRequestsTabProps> = ({
  classRequests,
  onRefresh
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [refundModalItem, setRefundModalItem] = useState<StudentClassRequest | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');
  const [editClassModalItem, setEditClassModalItem] = useState<StudentClassRequest | null>(null);

  // Tab filter state: 'ALL' | 'ASSIGNED' | 'OPEN' | 'CANCELLED'
  const [activeSubTab, setActiveSubTab] = useState<'ALL' | 'ASSIGNED' | 'OPEN' | 'CANCELLED'>('ALL');

  // Count items by category for tab badges
  const counts = useMemo(() => {
    let all = classRequests.length;
    let assigned = 0;
    let open = 0;
    let cancelled = 0;

    classRequests.forEach((item) => {
      const refundTickets = item.refund_tickets || (item as any).refundTickets || [];
      const hasPendingRefund = refundTickets.some((t: any) => t.status === 'PENDING') || (item as any).has_pending_refund;

      const isAssigned =
        (item.is_active_offline_class && item.status === 'ACTIVE') ||
        item.status === 'WAITING_PAYMENT' ||
        item.status === 'WAITING_TUTOR_CONFIRM';

      const isOpen =
        !item.is_active_offline_class &&
        (item.status === 'OPEN' || item.status === 'PENDING_ADMIN');

      const isCancelled =
        item.status === 'CANCELLED' ||
        item.status === 'EXPIRED' ||
        item.status === 'REJECTED' ||
        hasPendingRefund;

      if (isAssigned) assigned++;
      if (isOpen) open++;
      if (isCancelled) cancelled++;
    });

    return { all, assigned, open, cancelled };
  }, [classRequests]);

  // Filter requests based on selected sub-tab
  const filteredRequests = useMemo(() => {
    return classRequests.filter((item) => {
      if (activeSubTab === 'ALL') return true;

      const refundTickets = item.refund_tickets || (item as any).refundTickets || [];
      const hasPendingRefund = refundTickets.some((t: any) => t.status === 'PENDING') || (item as any).has_pending_refund;

      const isAssigned =
        (item.is_active_offline_class && item.status === 'ACTIVE') ||
        item.status === 'WAITING_PAYMENT' ||
        item.status === 'WAITING_TUTOR_CONFIRM';

      const isOpen =
        !item.is_active_offline_class &&
        (item.status === 'OPEN' || item.status === 'PENDING_ADMIN');

      const isCancelled =
        item.status === 'CANCELLED' ||
        item.status === 'EXPIRED' ||
        item.status === 'REJECTED' ||
        hasPendingRefund;

      if (activeSubTab === 'ASSIGNED') return isAssigned;
      if (activeSubTab === 'OPEN') return isOpen;
      if (activeSubTab === 'CANCELLED') return isCancelled;

      return true;
    });
  }, [classRequests, activeSubTab]);

  // Pagination states (3 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [classRequests, activeSubTab]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedList = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ/tháng';
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStatusBadge = (item: StudentClassRequest) => {
    const refundTickets = item.refund_tickets || (item as any).refundTickets || [];
    const hasPendingRefund = refundTickets.some((t: any) => t.status === 'PENDING') || (item as any).has_pending_refund;

    if (hasPendingRefund) {
      return (
        <span className="badge badge-warning" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} color="#d97706" />
          CHỜ ADMIN XỬ LÝ HỦY LỚP
        </span>
      );
    }

    if (item.is_active_offline_class) {
      if (item.status === 'CANCELLED') {
        return (
          <span className="badge badge-muted" style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={14} />
            LỚP ĐÃ HỦY (CANCELLED)
          </span>
        );
      }
      return (
        <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <UserCheck size={14} />
          LỚP ĐANG HOẠT ĐỘNG (ACTIVE)
        </span>
      );
    }

    switch (item.status) {
      case 'WAITING_PAYMENT': {
        const isStudentPaid = (item.payments || []).some((p: any) => p.type === 'STUDENT_TUITION' && p.status === 'PAID');
        if (isStudentPaid) {
          return (
            <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Check size={14} />
              ĐÃ NỘP HỌC PHÍ (CHỜ GIA SƯ ĐÓNG PHÍ)
            </span>
          );
        }
        return (
          <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            CHỜ ĐÓNG HỌC PHÍ ESCROW
          </span>
        );
      }
      case 'OPEN':
        return (
          <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span>
            ĐANG TÌM GIA SƯ (OPEN)
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={14} />
            TRỄ HẠN ĐÓNG PHÍ (EXPIRED)
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-muted" style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={14} />
            ĐÃ HỦY YÊU CẦU
          </span>
        );
      case 'WAITING_TUTOR_CONFIRM':
        return (
          <span className="badge badge-warning" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            CHỜ GS CHỈ ĐỊNH XÁC NHẬN
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} />
            ADMIN TỪ CHỐI
          </span>
        );
      case 'PENDING_ADMIN':
      default:
        return (
          <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            CHỜ ADMIN DUYỆT
          </span>
        );
    }
  };

  const handlePayTuition = async (requestId: string) => {
    try {
      setUpdating(true);
      const res = await axiosClient.post(`/class-requests/${requestId}/pay-tuition`);
      toast.success(res.data.message || 'Thanh toán học phí tháng đầu thành công!');
      onRefresh();
    } catch (err: any) {
      console.error('Error paying tuition:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán học phí.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelStudentPayment = async (requestId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn TỪ CHỐI nhận lớp học này và HỦY bài đăng không?')) {
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosClient.post(`/class-requests/${requestId}/cancel-student-payment`);
      toast.success(res.data.message || 'Đã từ chối nhận lớp thành công!');
      onRefresh();
    } catch (err: any) {
      console.error('Error cancelling student payment:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi từ chối nhận lớp.');
    } finally {
      setUpdating(false);
    }
  };

  const handleStartEditPrice = (req: StudentClassRequest) => {
    setEditingId(req.request_id || req.class_id || null);
    setEditPriceVal(String(req.desired_price));
  };

  const handleSavePrice = async (requestId: string) => {
    const num = Number(editPriceVal.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) {
      toast.error('Vui lòng nhập mức giá tiền hợp lệ (> 0 VNĐ)');
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosClient.patch(`/class-requests/my-requests/${requestId}`, {
        desired_price: num
      });
      toast.success(res.data.message || 'Cập nhật mức học phí thành công!');
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Error updating request price:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật số tiền.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn HỦY yêu cầu tìm gia sư này không?')) {
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosClient.patch(`/class-requests/my-requests/${requestId}`, {
        status: 'CANCELLED'
      });
      toast.success(res.data.message || 'Đã hủy yêu cầu tìm gia sư.');
      onRefresh();
    } catch (err: any) {
      console.error('Error cancelling request:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hủy yêu cầu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitRefundTicket = async () => {
    if (!refundModalItem || !refundModalItem.class_id) return;
    if (!refundReason.trim()) {
      toast.error('Vui lòng nhập lý do yêu cầu hủy/hoàn tiền.');
      return;
    }

    try {
      setUpdating(true);
      const res = await axiosClient.post(`/class-requests/offline-classes/${refundModalItem.class_id}/refund-tickets`, {
        reason: refundReason
      });
      toast.success(res.data.message || 'Đã gửi yêu cầu hủy lớp đến Admin.');
      setRefundModalItem(null);
      setRefundReason('');
      onRefresh();
    } catch (err: any) {
      console.error('Error submitting refund ticket:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="tab-content-container">
      <div className="tab-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList className="tab-title-icon" size={24} style={{ color: 'var(--primary)' }} />
            Yêu cầu tìm gia sư & Lớp Offline của tôi
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý các lớp yêu cầu, hoàn tất nộp học phí tháng đầu (escrow) và gửi yêu cầu hoàn tiền trong 7 ngày đầu nếu gặp sự cố.
          </p>
        </div>
      </div>

      {/* SUB-TABS FILTER BAR */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('ALL')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeSubTab === 'ALL' ? 'none' : '1px solid #cbd5e1',
            background: activeSubTab === 'ALL' ? 'var(--primary, #2563eb)' : '#ffffff',
            color: activeSubTab === 'ALL' ? '#ffffff' : '#475569',
            fontWeight: activeSubTab === 'ALL' ? 700 : 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            boxShadow: activeSubTab === 'ALL' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
          }}
        >
          <span>Tất cả</span>
          <span style={{
            background: activeSubTab === 'ALL' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
            color: activeSubTab === 'ALL' ? '#ffffff' : '#64748b',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ASSIGNED')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeSubTab === 'ASSIGNED' ? 'none' : '1px solid #cbd5e1',
            background: activeSubTab === 'ASSIGNED' ? '#16a34a' : '#ffffff',
            color: activeSubTab === 'ASSIGNED' ? '#ffffff' : '#475569',
            fontWeight: activeSubTab === 'ASSIGNED' ? 700 : 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            boxShadow: activeSubTab === 'ASSIGNED' ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none'
          }}
        >
          <span>Lớp đã giao</span>
          <span style={{
            background: activeSubTab === 'ASSIGNED' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
            color: activeSubTab === 'ASSIGNED' ? '#ffffff' : '#64748b',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {counts.assigned}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('OPEN')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeSubTab === 'OPEN' ? 'none' : '1px solid #cbd5e1',
            background: activeSubTab === 'OPEN' ? '#2563eb' : '#ffffff',
            color: activeSubTab === 'OPEN' ? '#ffffff' : '#475569',
            fontWeight: activeSubTab === 'OPEN' ? 700 : 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            boxShadow: activeSubTab === 'OPEN' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
          }}
        >
          <span>Lớp đang đăng công khai</span>
          <span style={{
            background: activeSubTab === 'OPEN' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
            color: activeSubTab === 'OPEN' ? '#ffffff' : '#64748b',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {counts.open}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('CANCELLED')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: activeSubTab === 'CANCELLED' ? 'none' : '1px solid #cbd5e1',
            background: activeSubTab === 'CANCELLED' ? '#dc2626' : '#ffffff',
            color: activeSubTab === 'CANCELLED' ? '#ffffff' : '#475569',
            fontWeight: activeSubTab === 'CANCELLED' ? 700 : 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            boxShadow: activeSubTab === 'CANCELLED' ? '0 2px 6px rgba(220, 38, 38, 0.25)' : 'none'
          }}
        >
          <span>Lớp đã hủy / Hết hạn</span>
          <span style={{
            background: activeSubTab === 'CANCELLED' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
            color: activeSubTab === 'CANCELLED' ? '#ffffff' : '#64748b',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {counts.cancelled}
          </span>
        </button>
      </div>

      {classRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <ClipboardList size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <h3 style={{ color: '#334155', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Bạn chưa gửi yêu cầu tìm gia sư nào</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
            Bạn có thể đăng ký tạo lớp gia sư mới để trung tâm liên hệ và xếp gia sư phù hợp nhất.
          </p>
          <Link 
            to="/tim-gia-su" 
            style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
          >
            + Đăng ký tìm gia sư ngay
          </Link>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <ClipboardList size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <h3 style={{ color: '#334155', margin: '0 0 8px 0', fontSize: '1.05rem' }}>Không có bài đăng / lớp học nào trong danh mục này</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            Vui lòng chọn danh mục khác để xem chi tiết các lớp yêu cầu của bạn.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {paginatedList.map((item) => {
            const reqId = item.request_id || item.class_id || '';
            const isWaitingPayment = item.status === 'WAITING_PAYMENT';
            const isActiveClass = item.is_active_offline_class && item.status === 'ACTIVE';
            const isStudentPaid = (item.payments || []).some((p: any) => p.type === 'STUDENT_TUITION' && p.status === 'PAID');

            const refundTickets = item.refund_tickets || (item as any).refundTickets || [];
            const hasPendingRefund = refundTickets.some((t: any) => t.status === 'PENDING') || (item as any).has_pending_refund;

            return (
              <div 
                key={reqId}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: isWaitingPayment ? '2px solid #eab308' : hasPendingRefund ? '2px solid #f59e0b' : isActiveClass ? '2px solid #22c55e' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: '20px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1.05rem' }}>
                        MS: {item.code || item.class_code || reqId.slice(0, 8).toUpperCase()}
                      </span>
                      {renderStatusBadge(item)}
                      {item.selected_tutor_code && (
                        <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          🎯 GS CHỈ ĐỊNH: {item.selected_tutor?.full_name ? `${item.selected_tutor.full_name} (${item.selected_tutor_code})` : item.selected_tutor_code}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.83rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      Ngày tạo: {formatDate(item.created_at)}
                    </div>
                  </div>

                  {/* Price Display & Edit Action */}
                  <div style={{ textAlign: 'right' }}>
                    {editingId === reqId ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          value={editPriceVal}
                          onChange={(e) => setEditPriceVal(e.target.value)}
                          placeholder="Nhập giá mới..."
                          style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #2563eb', fontSize: '0.9rem', width: '140px', outline: 'none' }}
                        />
                        <button
                          type="button"
                          disabled={updating}
                          onClick={() => handleSavePrice(reqId)}
                          style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Check size={14} />
                          Lưu
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          style={{ padding: '6px 10px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                          {formatCurrency(Number(item.desired_price))}
                        </span>
                        {!item.is_active_offline_class && item.status !== 'CANCELLED' && item.status !== 'EXPIRED' && item.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleStartEditPrice(item)}
                            title="Sửa số tiền mong muốn"
                            style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Edit3 size={12} />
                            Sửa giá
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Request Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.83rem', display: 'block' }}>Môn học & Khối lớp:</span>
                    <strong style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <BookOpen size={16} color="#2563eb" />
                      {item.subject_name} ({formatGradeLevel(item.grade_level)})
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.83rem', display: 'block' }}>Địa chỉ học:</span>
                    <strong style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <MapPin size={16} color="#ef4444" />
                      {item.address_detail}{item.district ? `, ${item.district}` : ''}{item.province ? `, ${item.province}` : ''}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.83rem', display: 'block' }}>Thời gian học:</span>
                    <span style={{ color: '#1e293b', marginTop: '2px', display: 'block' }}>
                      {item.sessions_per_week} buổi/tuần {item.study_time ? `• ${item.study_time}` : ''}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.83rem', display: 'block' }}>
                      {item.tutor_name || item.assigned_tutor?.full_name ? 'Gia sư đảm nhận:' : item.selected_tutor_code ? 'Gia sư chỉ định:' : 'Yêu cầu gia sư:'}
                    </span>
                    <span style={{ color: '#1e293b', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                      {item.tutor_name || item.assigned_tutor?.full_name ? (
                        <>
                          {item.tutor_name || item.assigned_tutor?.full_name}
                          {(item.tutor_phone || item.assigned_tutor?.phone) && (
                            <span style={{ color: '#2563eb', marginLeft: '6px' }}>
                              • SĐT: {item.tutor_phone || item.assigned_tutor?.phone}
                            </span>
                          )}
                        </>
                      ) : item.selected_tutor_code ? (
                        <span style={{ color: '#4338ca', fontWeight: 700 }}>
                          🎯 {item.selected_tutor?.full_name ? `${item.selected_tutor.full_name} (${item.selected_tutor_code})` : item.selected_tutor_code}
                        </span>
                      ) : (
                        item.tutor_requirement || 'Chưa phân công'
                      )}
                    </span>
                  </div>
                </div>

                {/* WAITING PAYMENT ACTIONS */}
                {isWaitingPayment && (
                  <>
                    {isStudentPaid ? (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                        <div style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Check size={18} color="#16a34a" />
                          ✓ Đã hoàn tất nộp học phí tháng đầu giữ chỗ (Escrow)!
                        </div>
                        <p style={{ color: '#15803d', fontSize: '0.83rem', margin: '0 0 8px 0' }}>
                          Đang chờ Gia sư hoàn tất nộp phí nhận lớp để hệ thống chính thức kích hoạt (ACTIVE) lớp học.
                        </p>
                        <PaymentCountdown deadline={item.payment_deadline} />
                      </div>
                    ) : (
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                        <div style={{ color: '#92400e', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={18} />
                          Yêu cầu nộp tiền giữ chỗ (Escrow): Học phí tháng đầu
                        </div>
                        <p style={{ color: '#78350f', fontSize: '0.83rem', margin: '0 0 10px 0' }}>
                          Admin đã duyệt chọn gia sư cho lớp học của bạn. Để kích hoạt lớp học chính thức (ACTIVE), bạn cần nộp khoản học phí tháng đầu giữ chỗ ({formatCurrency(Number(item.desired_price))}).
                        </p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => handlePayTuition(reqId)}
                            style={{
                              padding: '10px 20px',
                              background: '#d97706',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)',
                            }}
                          >
                            {updating ? 'Đang xử lý...' : 'Nộp học phí tháng đầu ngay →'}
                          </button>
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => handleCancelStudentPayment(reqId)}
                            style={{
                              padding: '10px 18px',
                              background: '#ffffff',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: updating ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <XCircle size={16} />
                            Từ chối nhận lớp này
                          </button>
                        </div>
                        <PaymentCountdown deadline={item.payment_deadline} />
                      </div>
                    )}
                  </>
                )}

                {item.status === 'WAITING_TUTOR_CONFIRM' && (
                  <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                    <div style={{ color: '#0369a1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={18} color="#0284c7" />
                      Đang chờ Gia sư được chỉ định xác nhận lời mời nhận lớp!
                    </div>
                    <p style={{ color: '#0c4a6e', fontSize: '0.83rem', margin: 0 }}>
                      Admin đã duyệt bài đăng của bạn. Hệ thống đã gửi thông báo đến Gia sư được chỉ định. Nếu Gia sư từ chối, yêu cầu sẽ tự động chuyển sang bài đăng công khai để các Gia sư khác ứng tuyển.
                    </p>
                  </div>
                )}

                {item.status === 'REJECTED' && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                    <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={18} color="#dc2626" />
                      Bài đăng tìm gia sư đã bị Admin từ chối.
                    </div>
                    {(item as any).admin_note && (
                      <p style={{ color: '#7f1d1d', fontSize: '0.83rem', margin: '0 0 10px 0' }}>
                        <strong>Lý do từ chối:</strong> {(item as any).admin_note}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditClassModalItem(item)}
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                      }}
                    >
                      <Edit3 size={15} />
                      Sửa & Gửi lại cho Admin duyệt →
                    </button>
                  </div>
                )}

                {/* PENDING REFUND TICKET NOTICE */}
                {hasPendingRefund ? (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ color: '#b45309', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={18} color="#d97706" />
                      <span>⏳ Đã gửi yêu cầu Hủy lớp & Hoàn tiền!</span>
                    </div>
                    <p style={{ color: '#78350f', fontSize: '0.83rem', margin: 0, lineHeight: '1.4' }}>
                      Hệ thống đã tiếp nhận đơn yêu cầu của bạn. Admin đang tiến hành xem xét minh chứng và chốt quyết định đền bù hoàn tiền trong thời gian sớm nhất.
                    </p>
                  </div>
                ) : isActiveClass ? (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}>
                        ✓ Lớp học đang hoạt động (ACTIVE).
                      </span>
                      {item.refund_deadline && (
                        <span style={{ color: '#15803d', fontSize: '0.8rem', display: 'block', marginTop: '2px' }}>
                          Cửa sổ bảo hộ hủy/hoàn tiền 7 ngày có hiệu lực đến: {new Date(item.refund_deadline).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setRefundModalItem(item)}
                      style={{
                        background: '#ffffff',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={14} />
                      Yêu cầu hủy lớp / Hoàn tiền
                    </button>
                  </div>
                ) : null}

                {/* Edit & Cancel actions if editable */}
                {!item.is_active_offline_class && item.status !== 'CANCELLED' && item.status !== 'EXPIRED' && !isWaitingPayment && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setEditClassModalItem(item)}
                      style={{
                        background: '#f0f9ff',
                        color: '#0284c7',
                        border: '1px solid #bae6fd',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Edit3 size={14} />
                      Sửa thông tin bài đăng
                    </button>

                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleCancelRequest(reqId)}
                      style={{
                        background: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <XCircle size={14} />
                      Hủy yêu cầu
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* PAGINATION CONTROLS */}
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
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
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
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: page === currentPage ? 'none' : '1px solid #cbd5e1',
                    background: page === currentPage ? '#2563eb' : '#ffffff',
                    color: page === currentPage ? '#ffffff' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.9rem',
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
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'all 0.15s ease'
                }}
              >
                Trang sau <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL GỬI REFUND TICKET */}
      {refundModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem', fontWeight: 800, color: '#991b1b' }}>
              Yêu Cầu Hủy Lớp & Hoàn Tiền (7 Ngày Đầu)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.4' }}>
              Lớp: <strong>MS: {refundModalItem.code || refundModalItem.class_code}</strong>.
              <br />
              Trường hợp có sự cố phát sinh trong 7 ngày đầu, vui lòng trình bày lý do rõ ràng để Admin đối soát căn cứ và chốt mức hoàn tiền theo quy định (phạt 10% nếu lỗi do Học viên, hoàn 100% nếu lỗi do Gia sư).
            </p>

            <textarea
              rows={4}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Nhập chi tiết lý do sự cố cần hủy lớp (VD: gia sư không đến dạy, sai thỏa thuận...)"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setRefundModalItem(null); setRefundReason(''); }}
                style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={handleSubmitRefundTicket}
                style={{ padding: '8px 18px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: updating ? 'not-allowed' : 'pointer' }}
              >
                {updating ? 'Đang gửi...' : 'Gửi yêu cầu hủy lớp'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL EDIT CLASS REQUEST */}
      {editClassModalItem && (
        <EditClassRequestModal
          item={editClassModalItem}
          onClose={() => setEditClassModalItem(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
