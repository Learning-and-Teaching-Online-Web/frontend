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
  Layers 
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import { formatGradeLevel } from '../../../utils/formatters';

interface ClassRequestItem {
  request_id: string;
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
  fee_amount?: number;
  assigned_tutor_id?: string;
  my_application_status?: string | null;
  _count?: { applications: number };
}

export const OfflineClassesTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'all' | 'directed'>('all');
  
  // Data States
  const [myClasses, setMyClasses] = useState<ClassRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [province, setProvince] = useState<string>('--Tất cả Tỉnh/Thành--');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pendingPaymentClass, setPendingPaymentClass] = useState<ClassRequestItem | null>(null);

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

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
  };

  // Filter lists
  const directedClasses = myClasses.filter(c => c.is_directed_to_me);

  // Filter displayedList based on subTab
  let displayedList: ClassRequestItem[] = subTab === 'directed' ? directedClasses : myClasses;

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

        {/* Tab Lớp được chỉ định */}
        <button
          type="button"
          onClick={() => setSubTab('directed')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: subTab === 'directed' ? '#6366f1' : '#f1f5f9',
            color: subTab === 'directed' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <Star size={16} color={subTab === 'directed' ? '#ffd700' : '#64748b'} />
          Lớp được chỉ định ({directedClasses.length})
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
            {subTab === 'directed'
              ? 'Hiện chưa có lớp nào học viên điền đúng mã gia sư chỉ định bạn'
              : 'Chưa có lớp học nào trong danh sách này'}
          </h4>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {subTab === 'directed'
              ? 'Khi học viên đăng ký tìm gia sư và điền đúng Mã gia sư của bạn, lớp học sẽ lập tức hiển thị tại đây.'
              : 'Vui lòng thử lại với từ khóa tìm kiếm hoặc lọc theo Tỉnh/Thành khác.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {displayedList.map((cls) => {
            const isDirected = cls.is_directed_to_me;
            const isWaitingFee = cls.status === 'WAITING_PAYMENT' && cls.is_assigned_to_me;
            const isActiveClass = (cls as any).is_active_offline_class || cls.status === 'ACTIVE';

            return (
              <div
                key={cls.request_id || (cls as any).class_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isWaitingFee
                    ? '2px solid #eab308'
                    : cls.status === 'EXPIRED'
                      ? '2px solid #ef4444'
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

                    {isWaitingFee ? (
                      <span style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        CHỜ ĐÓNG PHÍ ESCROW
                      </span>
                    ) : cls.status === 'EXPIRED' ? (
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} />
                        HẾT HẠN ĐÓNG PHÍ
                      </span>
                    ) : isActiveClass ? (
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} />
                        LỚP ĐANG HOẠT ĐỘNG (ACTIVE)
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
                        <div style={{ color: '#451a03', fontSize: '0.82rem' }}>
                          Nộp phí giữ chỗ để mở lớp chính thức cùng Học viên.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer / Actions */}
                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  {isActiveClass ? (
                    <div style={{ color: '#166534', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ✓ Bạn đã nhận lớp dạy thành công (Phí đã thanh toán)!
                    </div>
                  ) : cls.status === 'EXPIRED' ? (
                    <div style={{ color: '#991b1b', background: '#fee2e2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ✕ Đã quá hạn đóng phí. Lớp học đã được chuyển trả lại hệ thống.
                    </div>
                  ) : isWaitingFee ? (
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
    </div>
  );
};
