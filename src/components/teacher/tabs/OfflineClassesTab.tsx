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
  }, []);

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
    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ/tháng';
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

            return (
              <div
                key={cls.request_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isDirected 
                    ? (cls.status === 'ASSIGNED' ? '2px solid #22c55e' : '2px solid #6366f1')
                    : '1px solid #e2e8f0',
                  boxShadow: isDirected ? '0 4px 14px rgba(99,102,241,0.08)' : '0 4px 12px rgba(0,0,0,0.03)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Header Line */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1.05rem' }}>
                      MS: {cls.code}
                    </span>

                    {isDirected ? (
                      cls.status === 'ASSIGNED' ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} />
                          ĐÃ XÁC NHẬN DẠY
                        </span>
                      ) : (
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} fill="#6366f1" />
                          HỌC VIÊN CHỈ ĐỊNH
                        </span>
                      )
                    ) : (
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontWeight: 600, fontSize: '0.78rem' }}>
                        LỚP CỦA TÔI
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '4px' }}>
                      <strong>Học viên yêu cầu:</strong> {cls.student_name}
                      {cls.status === 'ASSIGNED' && cls.phone && (
                        <span style={{ color: '#2563eb', marginLeft: '6px', fontWeight: 600 }}>
                          • SĐT: {cls.phone}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                      <span><strong>Môn & Lớp:</strong> {cls.subject_name} ({cls.grade_level})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Địa chỉ học:</strong> {cls.address_detail}{cls.district ? `, ${cls.district}` : ''}{cls.province ? `, ${cls.province}` : ''}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span><strong>Mức lương:</strong> <span style={{ color: '#059669', fontWeight: 800, fontSize: '1rem' }}>{formatVND(Number(cls.desired_price))}</span></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} color="#d97706" style={{ flexShrink: 0 }} />
                      <span><strong>Số buổi:</strong> {cls.sessions_per_week} buổi/tuần {cls.study_time ? `• ${cls.study_time}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  {cls.status === 'ASSIGNED' ? (
                    <div style={{ color: '#166534', background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                      ✓ Bạn đã chấp nhận lớp dạy này. Trung tâm sẽ liên hệ xếp lịch với Học viên!
                    </div>
                  ) : isDirected ? (
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
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Đồng ý nhận lớp
                      </button>

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleRespondClass(cls.request_id, 'DECLINE')}
                        style={{
                          padding: '10px 14px',
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                        }}
                        title="Từ chối nhận lớp - Đẩy lớp về công khai để tuyển gia sư khác"
                      >
                        <XCircle size={16} />
                        Từ chối / Hủy
                      </button>
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
    </div>
  );
};
