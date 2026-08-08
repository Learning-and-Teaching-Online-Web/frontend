import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';

export interface StudentClassRequest {
  request_id: string;
  code?: string;
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
  selected_tutor?: { full_name: string; phone?: string | null; avatar_url?: string | null } | null;
  assigned_tutor?: { full_name: string; phone?: string | null; avatar_url?: string | null } | null;
  _count?: { applications: number };
}

interface ClassRequestsTabProps {
  classRequests: StudentClassRequest[];
  onRefresh: () => void;
}

export const ClassRequestsTab: React.FC<ClassRequestsTabProps> = ({
  classRequests,
  onRefresh
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></span>
            ĐANG TÌM GIA SƯ (OPEN)
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="badge badge-primary" style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={14} />
            ĐÃ GIAO LỚP
          </span>
        );
      case 'WAITING_TUTOR_CONFIRM':
        return (
          <span className="badge badge-info" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            CHỜ GS XÁC NHẬN
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-muted" style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={14} />
            ĐÃ HỦY YÊU CẦU
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} />
            BỊ TỪ CHỐI
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

  const handleStartEditPrice = (req: StudentClassRequest) => {
    setEditingId(req.request_id);
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
      toast.success(res.data.message || 'Cập nhật mức giá tiền thành công!');
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

  return (
    <div className="tab-content-container">
      <div className="tab-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList className="tab-title-icon" size={24} style={{ color: 'var(--primary)' }} />
            Yêu cầu tìm gia sư của tôi
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Quản lý danh sách các lớp học gia sư bạn đã gửi yêu cầu, theo dõi tiến độ duyệt và điều chỉnh học phí.
          </p>
        </div>
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
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {classRequests.map((item) => (
            <div 
              key={item.request_id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1.05rem' }}>
                      MS: {item.code || item.request_id.slice(0, 8).toUpperCase()}
                    </span>
                    {renderStatusBadge(item.status)}
                  </div>
                  <div style={{ fontSize: '0.83rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    Ngày gửi: {formatDate(item.created_at)}
                  </div>
                </div>

                {/* Price Display & Edit Action */}
                <div style={{ textAlign: 'right' }}>
                  {editingId === item.request_id ? (
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
                        onClick={() => handleSavePrice(item.request_id)}
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
                      {item.status !== 'CANCELLED' && item.status !== 'ASSIGNED' && (
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
                    {item.subject_name} ({item.grade_level || 'N/A'})
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
                  <span style={{ color: '#64748b', fontSize: '0.83rem', display: 'block' }}>Yêu cầu Gia sư:</span>
                  <span style={{ color: '#1e293b', marginTop: '2px', display: 'block' }}>
                    {item.tutor_requirement || 'Tùy trung tâm tư vấn'}
                  </span>
                </div>
              </div>

              {/* Tutor assignment info / Applications count */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  {item.assigned_tutor ? (
                    <span style={{ color: '#15803d', fontWeight: 600 }}>
                      ✓ Gia sư chính thức: {item.assigned_tutor.full_name}
                      {item.assigned_tutor.phone ? (
                        <span style={{ marginLeft: '6px', color: '#166534', fontWeight: 700 }}>
                          • SĐT liên hệ: {item.assigned_tutor.phone}
                        </span>
                      ) : (
                        <span style={{ marginLeft: '6px', color: '#854d0e', fontStyle: 'italic', fontWeight: 'normal' }}>
                          (Đang chờ cập nhật SĐT)
                        </span>
                      )}
                    </span>
                  ) : item.selected_tutor ? (
                    <span style={{ color: '#0369a1', fontWeight: 600 }}>
                       Gia sư đã chọn: {item.selected_tutor.full_name}
                      {item.selected_tutor.phone && ` • SĐT: ${item.selected_tutor.phone}`}
                    </span>
                  ) : (
                    <span style={{ color: '#475569' }}>
                      Số gia sư ứng tuyển nhận lớp: <strong style={{ color: '#2563eb' }}>{item._count?.applications || 0} gia sư</strong>
                    </span>
                  )}
                </div>

                {/* Cancel action */}
                {item.status !== 'CANCELLED' && item.status !== 'ASSIGNED' && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleCancelRequest(item.request_id)}
                    style={{
                      background: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      padding: '4px 12px',
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
