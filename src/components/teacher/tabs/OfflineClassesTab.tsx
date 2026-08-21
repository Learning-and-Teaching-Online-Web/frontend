import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  BookOpen, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Star, 
  User, 
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import { formatGradeLevel } from '../../../utils/formatters';

interface ClassRequestItem {
  request_id: string;
  class_id?: string;
  code: string;
  student_name: string;
  phone: string;
  address_detail: string;
  district?: string;
  province?: string;
  grade_level: string;
  subject_name: string;
  sessions_per_week: number;
  study_time?: string;
  tutor_requirement?: string;
  desired_price: number;
  commission_rate: number;
  status: string;
  created_at: string;
  is_directed_to_me?: boolean;
  is_assigned_to_me?: boolean;
  payment_deadline?: string;
  refund_deadline?: string;
  fee_amount?: number;
  assigned_tutor_id?: string;
  my_application_status?: string | null;
  tutor_payment_status?: string;
  payments?: any[];
  refund_tickets?: any[];
  _count?: { applications: number };
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
        ⏳ Thời hạn nộp phí: 24 giờ kể từ khi được duyệt
      </div>
    );
  }

  if (!timeLeft) return null;

  if (timeLeft.isExpired) {
    return (
      <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.84rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>⚠️ Đã hết hạn nộp phí! Lớp sẽ bị hủy hoặc chuyển trả về hệ thống.</span>
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
        Thời hạn đóng phí còn:
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

export const OfflineClassesTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'all' | 'assigned' | 'refund'>('all');
  
  // Data States
  const [myClasses, setMyClasses] = useState<ClassRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [province, setProvince] = useState<string>('--Tất cả Tỉnh/Thành--');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pendingPaymentClass, setPendingPaymentClass] = useState<ClassRequestItem | null>(null);
  const [refundModalItem, setRefundModalItem] = useState<ClassRequestItem | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');

  // Pagination states (4 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const res = await axiosClient.get('/tutors/wallet');
      if (res.data && res.data.success && res.data.data) {
        setWalletBalance(res.data.data.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  };

  // Fetch tutor specific classes (directed to tutor via tutor_code or tutor_id)
  const fetchMyClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/class-requests/tutor-classes');
      if (res.data && res.data.data) {
        setMyClasses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tutor classes:', err);
      toast.error('Lỗi khi tải danh sách lớp học của gia sư.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
    fetchWalletBalance();
  }, []);

  const handlePayCommission = async (requestId: string, feeAmount: number) => {
    if (walletBalance < feeAmount) {
      toast.error('Số dư ví không đủ! Vui lòng nạp thêm tiền vào ví.');
      const walletTabBtn = document.getElementById('tab-btn-wallet');
      if (walletTabBtn) {
        walletTabBtn.click();
        setTimeout(() => {
          const depSec = document.getElementById('wallet-deposit-section');
          if (depSec) depSec.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post(`/class-requests/${requestId}/pay-commission`);
      toast.success(res.data.message || 'Thanh toán phí nhận lớp thành công!');
      fetchMyClasses();
      fetchWalletBalance();
      setPendingPaymentClass(null); // Close confirm modal
    } catch (err: any) {
      console.error('Error paying commission:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAssignment = async (requestId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy nhận lớp học này không? Lớp sẽ được mở lại để các Gia sư khác ứng tuyển.')) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post(`/class-requests/${requestId}/cancel-assignment`);
      toast.success(res.data.message || 'Đã hủy nhận lớp thành công!');
      fetchMyClasses();
    } catch (err: any) {
      console.error('Error cancelling assignment:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hủy nhận lớp.');
    } finally {
      setSubmitting(false);
    }
  };

  // Tutor accepts or declines a class directed to them
  const handleRespondClass = async (requestId: string, action: 'ACCEPT' | 'DECLINE') => {
    const actionText = action === 'ACCEPT' ? 'ĐỒNG Ý NHẬN' : 'TỪ CHỐI / HỦY';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} lớp học này không?`)) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.patch(`/class-requests/tutor-respond/${requestId}`, { action });
      toast.success(res.data.message || 'Đã xử lý phản hồi nhận lớp thành công!');
      fetchMyClasses();
    } catch (err: any) {
      console.error('Error responding class:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi phản hồi nhận lớp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRefundTicket = async () => {
    const targetClassId = refundModalItem?.class_id || refundModalItem?.request_id;
    if (!refundModalItem || !targetClassId) return;
    if (!refundReason.trim()) {
      toast.error('Vui lòng nhập lý do yêu cầu hủy/hoàn tiền.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post(`/class-requests/offline-classes/${targetClassId}/refund-tickets`, {
        reason: refundReason.trim()
      });
      toast.success(res.data.message || 'Đã gửi yêu cầu hủy lớp đến Admin.');
      setRefundModalItem(null);
      setRefundReason('');
      fetchMyClasses();
    } catch (err: any) {
      console.error('Error submitting refund ticket:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };

  // Filter lists
  const assignedClasses = myClasses.filter(c => c.status !== 'CANCELLED' && (c.is_assigned_to_me || c.status === 'ACTIVE' || c.status === 'WAITING_PAYMENT'));
  const refundClasses = myClasses.filter(c => 
    c.status === 'CANCELLED' || 
    c.status === 'REFUNDED' || 
    c.my_application_status === 'CANCELLED' || 
    c.my_application_status === 'EXPIRED' || 
    (c.refund_tickets && c.refund_tickets.length > 0) || 
    (c as any).has_pending_refund || 
    (c.payments || []).some((p: any) => p.status === 'REFUNDED')
  );

  // Filter displayedList based on subTab
  let displayedList: ClassRequestItem[] = myClasses;
  if (subTab === 'assigned') {
    displayedList = assignedClasses;
  } else if (subTab === 'refund') {
    displayedList = refundClasses;
  }

  // Filter displayedList by province if selected
  if (province && province !== '--Tất cả Tỉnh/Thành--') {
    displayedList = displayedList.filter(c => c.province && c.province.toLowerCase().includes(province.toLowerCase()));
  }

  // Filter displayedList by search query if any
  if (search.trim()) {
    const q = search.trim().toLowerCase().replace(/^ms:\s*/i, '');
    displayedList = displayedList.filter(c => 
      c.code?.toLowerCase().includes(q) ||
      c.subject_name?.toLowerCase().includes(q) ||
      c.address_detail?.toLowerCase().includes(q) ||
      c.district?.toLowerCase().includes(q)
    );
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, province, subTab]);

  const totalPages = Math.ceil(displayedList.length / ITEMS_PER_PAGE);
  const paginatedList = displayedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="section-card">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
            <ClipboardList color="#6366f1" size={24} />
            Quản lý Lớp Offline dạy kèm
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-light)' }}>
            Quản lý danh sách lớp học offline và phản hồi nhận lớp khi học viên điền đúng mã gia sư chỉ định bạn.
          </p>
        </div>
      </div>

      {/* SUB TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        {/* Tab Tất cả */}
        <button
          type="button"
          onClick={() => setSubTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: subTab === 'all' ? '#6366f1' : '#f1f5f9',
            color: subTab === 'all' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={16} />
          Tất cả lớp ({myClasses.length})
        </button>

        {/* Tab Tất cả */}

        {/* Tab Lớp đã giao */}
        <button
          type="button"
          onClick={() => setSubTab('assigned')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: subTab === 'assigned' ? '#6366f1' : '#f1f5f9',
            color: subTab === 'assigned' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={16} color={subTab === 'assigned' ? '#ffffff' : '#22c55e'} />
          Lớp đã giao ({assignedClasses.length})
        </button>

        {/* Tab Hủy & Hoàn tiền */}
        <button
          type="button"
          onClick={() => setSubTab('refund')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: subTab === 'refund' ? '#6366f1' : '#f1f5f9',
            color: subTab === 'refund' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <RotateCcw size={16} color={subTab === 'refund' ? '#ffffff' : '#ef4444'} />
          Hủy & Hoàn tiền ({refundClasses.length})
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Tìm theo Mã lớp (VD: 90414), Môn học, Địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            background: 'white',
            outline: 'none',
            minWidth: '200px'
          }}
        >
          <option value="--Tất cả Tỉnh/Thành--">--Tất cả Tỉnh/Thành--</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Bình Dương">Bình Dương</option>
          <option value="Đồng Nai">Đồng Nai</option>
          <option value="Cần Thơ">Cần Thơ</option>
        </select>
      </div>

      {/* DISPLAY CARDS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
          Đang tải danh sách lớp học...
        </div>
      ) : displayedList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <User size={40} style={{ color: '#94a3b8', marginBottom: '8px' }} />
          <h4 style={{ color: '#334155', margin: '0 0 4px 0' }}>
            {subTab === 'assigned'
              ? 'Chưa có lớp học nào được Admin duyệt giao cho bạn'
              : subTab === 'refund'
              ? 'Chưa có lớp nào có yêu cầu Hủy hoặc Hoàn tiền'
              : 'Chưa có lớp học nào trong danh sách này'}
          </h4>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {subTab === 'assigned'
              ? 'Các lớp bạn đã được duyệt nhận và đang trong quá trình nộp phí hoặc đang hoạt động sẽ hiển thị tại đây.'
              : subTab === 'refund'
              ? 'Các lớp đang trong thời gian bảo hộ 7 ngày hoặc có yêu cầu hủy/hoàn tiền sẽ hiển thị tại đây.'
              : 'Vui lòng thử lại với từ khóa tìm kiếm hoặc lọc theo Tỉnh/Thành khác.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {paginatedList.map((cls) => {
              const isCancelledClass = cls.status === 'CANCELLED';
              const isMyApplicationCancelled = cls.my_application_status === 'CANCELLED';
              const isDirected = cls.is_directed_to_me;
              const isTutorPaid = (cls.payments || []).some((p: any) => p.type === 'TUTOR_PLACEMENT_FEE' && p.status === 'PAID') || cls.tutor_payment_status === 'PAID';
              const isTutorRefunded = (cls.payments || []).some((p: any) => p.type === 'TUTOR_PLACEMENT_FEE' && p.status === 'REFUNDED');
              const isDeadlineExpired = cls.payment_deadline ? new Date(cls.payment_deadline).getTime() < Date.now() : false;
              const isApplicationExpired = (cls.my_application_status === 'EXPIRED' || cls.status === 'EXPIRED' || (cls.status === 'WAITING_PAYMENT' && isDeadlineExpired && !isTutorPaid)) && !isTutorRefunded && !isCancelledClass && !isMyApplicationCancelled;
              const isWaitingFee = cls.status === 'WAITING_PAYMENT' && cls.is_assigned_to_me && !isApplicationExpired && !isTutorRefunded && !isCancelledClass && !isMyApplicationCancelled;
              const isActiveClass = !isCancelledClass && ((cls as any).is_active_offline_class || cls.status === 'ACTIVE') && cls.status !== 'CANCELLED';
              const refundTickets = cls.refund_tickets || (cls as any).refundTickets || [];
              const hasPendingRefund = refundTickets.some((t: any) => t.status === 'PENDING') || (cls as any).has_pending_refund;

            return (
              <div
                key={cls.request_id || (cls as any).class_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isCancelledClass
                    ? '2px solid #ef4444'
                    : isWaitingFee
                      ? '2px solid #eab308'
                      : isTutorRefunded
                        ? '2px solid #3b82f6'
                        : isApplicationExpired
                          ? '2px solid #ef4444'
                          : hasPendingRefund
                            ? '2px solid #f59e0b'
                            : isActiveClass
                              ? '2px solid #22c55e'
                              : '1px solid #e2e8f0',
                  boxShadow: isWaitingFee
                    ? '0 4px 14px rgba(234,179,8,0.1)'
                    : isDirected ? '0 4px 14px rgba(99,102,241,0.08)' : '0 4px 12px rgba(0,0,0,0.03)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  {/* Header Line */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1.05rem' }}>
                      MS: {cls.code || (cls as any).class_offline_code}
                    </span>

                    {isTutorRefunded ? (
                      cls.status === 'CANCELLED' ? (
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RotateCcw size={14} />
                          ĐÃ HOÀN 100% PHÍ (HỌC VIÊN HỦY LỚP)
                        </span>
                      ) : (
                        <span style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RotateCcw size={14} />
                          ĐÃ HOÀN 100% PHÍ (QUÁ HẠN NỘP HỌC PHÍ)
                        </span>
                      )
                    ) : isCancelledClass ? (
                      <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} />
                        LỚP ĐÃ HỦY (CANCELLED)
                      </span>
                    ) : isWaitingFee ? (
                      isTutorPaid ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} />
                          ĐÃ ĐÓNG PHÍ (CHỜ HỌC VIÊN)
                        </span>
                      ) : (
                        <span style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          CHỜ ĐÓNG PHÍ ESCROW
                        </span>
                      )
                    ) : isMyApplicationCancelled ? (
                      <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} />
                        BẠN ĐÃ HỦY NHẬN LỚP
                      </span>
                    ) : isApplicationExpired ? (
                      <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        HẾT HẠN ĐÓNG PHÍ NHẬN LỚP
                      </span>
                    ) : hasPendingRefund ? (
                      <span style={{ background: '#fffbeb', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        CHỜ ADMIN XỬ LÝ HỦY LỚP
                      </span>
                    ) : isActiveClass ? (
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} />
                        LỚP ĐANG HOẠT ĐỘNG (ACTIVE)
                      </span>
                    ) : cls.my_application_status === 'REJECTED' ? (
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} />
                        ĐƠN BỊ TỪ CHỐI
                      </span>
                    ) : (
                      <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#6366f1" />
                        ĐANG ỨNG TUYỂN / CHỜ DUYỆT
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '4px' }}>
                      <strong>Học viên yêu cầu:</strong> {cls.student_name}
                      {cls.phone && (
                        <span style={{ color: '#2563eb', marginLeft: '6px', fontWeight: 600 }}>
                          • SĐT: {cls.phone}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                      <span><strong>Môn & Lớp:</strong> {cls.subject_name} ({formatGradeLevel(cls.grade_level)})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Địa chỉ học:</strong> {cls.address_detail}{cls.district ? `, ${cls.district}` : ''}{cls.province ? `, ${cls.province}` : ''}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span><strong>Mức lương:</strong> <span style={{ color: '#059669', fontWeight: 800, fontSize: '1rem' }}>{formatVND(Number(cls.desired_price))}/tháng</span></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} color="#d97706" style={{ flexShrink: 0 }} />
                      <span><strong>Số buổi:</strong> {cls.sessions_per_week} buổi/tuần {cls.study_time ? `• ${cls.study_time}` : ''}</span>
                    </div>

                    {/* Phí nhận lớp cảnh báo & countdown */}
                    {isWaitingFee && cls.fee_amount && (
                      <>
                        {isTutorPaid ? (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '10px',
                            fontSize: '0.85rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, marginBottom: '4px' }}>
                              <span>✓ Bạn đã hoàn tất đóng phí nhận lớp!</span>
                            </div>
                            <div style={{ color: '#15803d', fontSize: '0.82rem', marginBottom: '4px' }}>
                              Đang chờ Học viên nộp học phí tháng đầu để chính thức kích hoạt lớp học.
                            </div>
                            <PaymentCountdown deadline={cls.payment_deadline} />
                          </div>
                        ) : (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '10px',
                            fontSize: '0.85rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, marginBottom: '6px' }}>
                              <span>⚠️ Phí nhận lớp (35%): {formatVND(Number(cls.fee_amount))}</span>
                            </div>
                            <div style={{ color: '#451a03', fontSize: '0.82rem', marginBottom: '4px' }}>
                              Nộp phí giữ chỗ để mở lớp chính thức cùng Học viên.
                            </div>
                            <PaymentCountdown deadline={cls.payment_deadline} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Footer / Actions */}
                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  {isCancelledClass ? (
                    isTutorRefunded ? (
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ color: '#1e40af', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={16} color="#2563eb" />
                          <span>✓ Học viên đã từ chối nhận lớp!</span>
                        </div>
                        <div style={{ color: '#1e3a8a', fontSize: '0.82rem', lineHeight: '1.4' }}>
                          Học viên đã chủ động hủy bài đăng hoặc từ chối nhận lớp. Hệ thống đã tự động hoàn trả 100% phí nhận lớp ({formatVND(Number(cls.fee_amount || (Number((cls as any).class_salary || 0) * 0.35)))}) về Ví cá nhân của bạn.
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <XCircle size={16} color="#dc2626" />
                          <span>✓ Lớp học đã Hủy!</span>
                        </div>
                        <div style={{ color: '#7f1d1d', fontSize: '0.82rem', lineHeight: '1.4' }}>
                          Bài đăng tìm gia sư / Lớp học này đã bị hủy bởi Học viên hoặc Admin.
                        </div>
                      </div>
                    )
                  ) : hasPendingRefund ? (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ color: '#b45309', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} color="#d97706" />
                        <span>⏳ Đã gửi yêu cầu Hủy lớp & Hoàn tiền!</span>
                      </div>
                      <div style={{ color: '#78350f', fontSize: '0.8rem', lineHeight: '1.4' }}>
                        Hệ thống đã tiếp nhận yêu cầu. Admin đang tiến hành đối soát minh chứng và sẽ chốt quyết định đền bù hoàn tiền sớm nhất.
                      </div>
                    </div>
                  ) : isActiveClass ? (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>
                        ✓ Bạn đã nhận lớp dạy thành công (Phí đã thanh toán)!
                      </div>
                      {cls.refund_deadline && (
                        <div style={{ color: '#15803d', fontSize: '0.78rem' }}>
                          Bảo hộ hủy/hoàn tiền 7 ngày có hiệu lực đến: {new Date(cls.refund_deadline).toLocaleString('vi-VN')}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setRefundModalItem(cls)}
                        style={{
                          marginTop: '4px',
                          background: '#ffffff',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          width: '100%'
                        }}
                      >
                        <RotateCcw size={14} />
                        Yêu cầu hủy lớp / Hoàn tiền (7 ngày)
                      </button>
                    </div>
                  ) : isTutorRefunded ? (
                    <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ color: '#5b21b6', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#7c3aed" />
                        <span>✓ Học viên không nộp học phí đúng hạn 48h!</span>
                      </div>
                      <div style={{ color: '#4c1d95', fontSize: '0.82rem', lineHeight: '1.4' }}>
                        Học viên đã quá thời hạn 48h đóng học phí tháng đầu giữ chỗ. Hệ thống đã tự động hoàn trả 100% phí nhận lớp ({formatVND(Number(cls.fee_amount || (Number((cls as any).class_salary || 0) * 0.35)))}) về Ví cá nhân của bạn.
                      </div>
                    </div>
                  ) : isMyApplicationCancelled ? (
                    <div style={{ color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ✕ Bạn đã chủ động hủy nhận lớp học này. Lớp học đã được chuyển trả lại hệ thống để các Gia sư khác ứng tuyển.
                    </div>
                  ) : isApplicationExpired ? (
                    <div style={{ color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ✕ Đã quá thời hạn nộp phí nhận lớp giữ chỗ. Lớp học đã được chuyển trả lại hệ thống.
                    </div>
                  ) : cls.my_application_status === 'REJECTED' ? (
                    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={16} />
                        Đơn ứng tuyển đã bị từ chối
                      </div>
                      <div style={{ color: '#7f1d1d', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        Lớp học này đã được giao cho gia sư khác và chính thức bắt đầu hoạt động.
                      </div>
                    </div>
                  ) : isWaitingFee ? (
                    isTutorPaid ? (
                      <div style={{ color: '#166534', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                        ✓ Đã thanh toán phí nhận lớp — Đang chờ Học viên!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => {
                            if (walletBalance >= Number(cls.fee_amount || 0)) {
                              setPendingPaymentClass(cls);
                            } else {
                              toast.error(`Số dư ví không đủ! Cần ${formatVND(Number(cls.fee_amount))} để đóng phí.`);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '10px',
                            background: walletBalance >= Number(cls.fee_amount || 0) ? '#eab308' : '#cbd5e1',
                            color: walletBalance >= Number(cls.fee_amount || 0) ? '#ffffff' : '#64748b',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: walletBalance >= Number(cls.fee_amount || 0) ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: walletBalance >= Number(cls.fee_amount || 0) ? '0 2px 6px rgba(234, 179, 8, 0.25)' : 'none'
                          }}
                        >
                          {submitting ? 'Đang xử lý...' : (walletBalance >= Number(cls.fee_amount || 0) ? 'Thanh toán phí & Nhận lớp' : 'Số dư ví không đủ')}
                        </button>

                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleCancelAssignment(cls.request_id)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          Hủy nhận lớp
                        </button>

                        {walletBalance < Number(cls.fee_amount || 0) && (
                          <button
                            type="button"
                            onClick={() => {
                              const walletTabBtn = document.getElementById('tab-btn-wallet');
                              if (walletTabBtn) {
                                walletTabBtn.click();
                                setTimeout(() => {
                                  const depSec = document.getElementById('wallet-deposit-section');
                                  if (depSec) depSec.scrollIntoView({ behavior: 'smooth' });
                                }, 200);
                              } else {
                                toast.info('Vui lòng chuyển sang tab Ví tiền để nạp tiền.');
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '8px',
                              background: '#f8fafc',
                              color: '#2563eb',
                              border: '1px dashed #2563eb',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            Nạp tiền ngay →
                          </button>
                        )}
                      </div>
                    )
                  ) : isDirected && cls.status === 'WAITING_TUTOR_CONFIRM' && !cls.is_assigned_to_me ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleRespondClass(cls.request_id, 'ACCEPT')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        ĐỒNG Ý NHẬN
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleRespondClass(cls.request_id, 'DECLINE')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        TỪ CHỐI / HỦY
                      </button>
                    </div>
                  ) : isDirected && cls.status === 'PENDING_ADMIN' ? (
                    <div style={{ color: '#0ea5e9', background: '#f0f9ff', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ⏳ Đang chờ Admin duyệt và báo phí nhận lớp...
                    </div>
                  ) : (
                    <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center' }}>
                      Đang xử lý ứng tuyển...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
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
                  background: page === currentPage ? '#6366f1' : '#ffffff',
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
      </>
      )}

      {/* Custom Payment Confirmation Modal */}
      {pendingPaymentClass && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-card" style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b' }}>
              Xác Nhận Thanh Toán Phí
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Bạn có chắc chắn muốn thanh toán phí nhận lớp cho lớp 
              <strong style={{ color: '#f97316' }}> MS: {pendingPaymentClass.code}</strong> không?
              <br />
              Số tiền phí cần đóng: <strong style={{ color: '#059669', fontSize: '1.05rem' }}>{formatVND(Number(pendingPaymentClass.fee_amount))}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setPendingPaymentClass(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handlePayCommission(pendingPaymentClass.request_id, Number(pendingPaymentClass.fee_amount))}
                style={{
                  padding: '10px 20px',
                  background: '#eab308',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {submitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gia sư Gửi Refund Ticket */}
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
              Lớp: <strong>MS: {refundModalItem.code}</strong>.
              <br />
              Trường hợp có sự cố phát sinh trong 7 ngày đầu, vui lòng trình bày lý do rõ ràng để Admin đối soát căn cứ và chốt mức hoàn phí nhận lớp theo quy định (hoàn 100% nếu lỗi Học viên, hoàn 80%/phạt 20% nếu lỗi Gia sư).
            </p>

            <textarea
              rows={4}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Nhập chi tiết lý do sự cố cần hủy lớp..."
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
                disabled={submitting}
                onClick={handleSubmitRefundTicket}
                style={{ padding: '8px 18px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu hủy lớp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
