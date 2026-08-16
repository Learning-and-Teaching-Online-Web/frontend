import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import authStorage from '../utils/authStorage';
import tutorApi from '../services/tutorApi';
import { toast } from 'react-toastify';
import { MapPin, UserCheck, Send, ArrowLeft, ShieldAlert, LogIn, CheckCircle } from 'lucide-react';
import { formatGradeLevel } from '../utils/formatters';

interface Application {
  application_id: string;
  applicant_phone: string;
  available_from?: string;
  notes?: string;
  status: string;
  created_at: string;
  tutor?: {
    tutor_id?: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface ClassRequestDetail {
  request_id: string;
  code: string;
  student_name: string;
  phone: string;
  email?: string;
  address_detail: string;
  district?: string;
  province?: string;
  grade_level: string;
  subject_name: string;
  num_students: number;
  academic_level?: string;
  sessions_per_week: number;
  study_time?: string;
  tutor_requirement?: string;
  desired_price: number;
  commission_rate: number;
  status: string;
  other_requirements?: string;
  created_at: string;
  applications?: Application[];
}

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classDetail, setClassDetail] = useState<ClassRequestDetail | null>(null);
  const [tutorProfile, setTutorProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isAuthenticated = authStorage.isAuthenticated();
  const userRole = authStorage.getUserRole();

  const [availableFrom, setAvailableFrom] = useState('');
  const [notes, setNotes] = useState('');

  const formatDateTime = (val?: string | null) => {
    if (!val) return 'Chưa cập nhật';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  };

  const fetchDetail = async () => {
    try {
      const res = await axiosClient.get(`/class-requests/${id}`);
      if (res.data && res.data.data) {
        setClassDetail(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
      toast.error('Không thể lấy thông tin lớp học.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && userRole === 'tutor') {
      tutorApi.getMyProfile()
        .then((res: any) => {
          if (res) {
            setTutorProfile(res.data || res);
          }
        })
        .catch((err: any) => console.error('Error fetching tutor profile:', err));
    }
  }, [isAuthenticated, userRole]);

  const profileData = tutorProfile?.data || tutorProfile;
  const tutorName = profileData?.full_name || profileData?.user?.full_name || authStorage.getUserName() || 'Gia sư';
  const tutorPhone = profileData?.phone || profileData?.user?.phone || '';
  const tutorAvatar = profileData?.avatar_url || profileData?.user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80';

  const myApplication = classDetail?.applications?.find((app: any) =>
    (profileData?.tutor_id && app.tutor?.tutor_id === profileData.tutor_id) ||
    (tutorPhone && app.applicant_phone === tutorPhone)
  );

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!availableFrom) {
      toast.error('Vui lòng chọn thời gian có thể nhận lớp!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        applicant_phone: tutorPhone || authStorage.getUserName() || 'Chưa cập nhật SĐT',
        available_from: new Date(availableFrom).toISOString(),
        notes,
      };

      const res = await axiosClient.post(`/class-requests/${id}/apply`, payload);
      toast.success(res.data.message || 'Xác nhận đăng ký nhận lớp thành công!');

      setAvailableFrom('');
      setNotes('');
      fetchDetail();
    } catch (err: any) {
      console.error('Error applying:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đồng/tháng';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Đang tải chi tiết lớp học...</div>;
  }

  if (!classDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Không tìm thấy thông tin lớp học.</h2>
        <Link to="/lop-hoc-moi" style={{ color: '#2563eb', fontWeight: '600' }}>Quay lại danh sách lớp</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 16px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>

        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link to="/lop-hoc-moi" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            <ArrowLeft size={18} /> Quay lại Danh sách Lớp dạy kèm mới
          </Link>
        </div>

        {/* Main Box Header */}
        <div style={{ background: '#0284c7', color: '#ffffff', padding: '14px 20px', borderRadius: '8px 8px 0 0', fontWeight: '700', fontSize: '1.1rem' }}>
          MS: {classDetail.code} - Việc làm gia sư dạy môn {classDetail.subject_name} {formatGradeLevel(classDetail.grade_level)} {classDetail.district} {classDetail.province}
        </div>

        {/* Main Content Layout (Grid 2 Columns) */}
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>

          {/* Left Column: Detail Info */}
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#1e293b' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Mã lớp:</strong> <span style={{ color: '#b45309', fontWeight: '700' }}>{classDetail.code}</span>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Lớp dạy:</strong> {formatGradeLevel(classDetail.grade_level)}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Môn dạy:</strong> {classDetail.subject_name}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Địa chỉ:</strong> {classDetail.address_detail} <MapPin size={16} style={{ color: '#ef4444', verticalAlign: 'middle' }} />
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Khu vực:</strong> {classDetail.province} - {classDetail.district}
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#16a34a' }}>
              <strong>Mức lương:</strong> <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{formatCurrency(Number(classDetail.desired_price))}</span>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Số buổi:</strong> {classDetail.sessions_per_week} buổi /tuần
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Thời gian dạy:</strong> {classDetail.study_time || 'Thỏa thuận'}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Yêu cầu gia sư:</strong> <span style={{ fontWeight: '600', color: '#0369a1' }}>{classDetail.tutor_requirement || 'Sinh viên / Giáo viên'}</span>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Thông tin người học:</strong> {classDetail.academic_level || 'Học sinh căn bản'}
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#475569' }}>
              <strong>Liên hệ trung tâm:</strong> 0974.502.420 - 0938.708.488
            </p>
          </div>

          {/* Right Column: ĐĂNG KÝ NHANH FORM Box */}
          <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0e7490', margin: '0 0 14px 0', textAlign: 'center', textTransform: 'uppercase' }}>
              ĐĂNG KÝ NHANH
            </h3>

            {!isAuthenticated ? (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <LogIn size={36} style={{ color: '#0891b2', marginBottom: '10px' }} />
                <p style={{ fontSize: '0.88rem', color: '#155e75', marginBottom: '16px', lineHeight: 1.5 }}>
                  Vui lòng đăng nhập tài khoản <strong>Gia sư</strong> để ứng tuyển nhận lớp học này.
                </p>
                <Link
                  to="/auth"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  <LogIn size={16} /> Đăng nhập Gia sư
                </Link>
              </div>
            ) : userRole !== 'tutor' ? (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <ShieldAlert size={36} style={{ color: '#0891b2', marginBottom: '10px' }} />
                <p style={{ fontSize: '0.88rem', color: '#155e75', marginBottom: '16px', lineHeight: 1.5 }}>
                  Chỉ tài khoản <strong>Gia sư</strong> mới có thể đăng ký nhận lớp dạy này.
                </p>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
                  Nếu bạn là Học viên, bạn có thể tạo yêu cầu tìm gia sư mới.
                </p>
                <Link
                  to="/tim-gia-su"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none'
                  }}
                >
                  + Đăng bài tìm gia sư
                </Link>
              </div>
            ) : myApplication ? (
              <div style={{ textAlign: 'center', padding: '12px 6px' }}>
                <CheckCircle size={44} style={{ color: '#16a34a', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d', margin: '0 0 6px 0' }}>
                  ✓ ĐÃ ĐĂNG KÝ NHẬN LỚP
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px', lineHeight: 1.5 }}>
                  Đơn ứng tuyển của bạn đã được gửi thành công và đang ở trạng thái <strong>CHỜ ADMIN DUYỆT</strong>.
                </p>

                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px', textAlign: 'left', fontSize: '0.84rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                  <div style={{ marginBottom: '6px' }}><strong>SĐT ứng tuyển:</strong> {myApplication.applicant_phone}</div>
                  <div style={{ marginBottom: '6px' }}><strong>Thời gian nhận lớp:</strong> {formatDateTime(myApplication.available_from)}</div>
                  <div><strong>Trạng thái đơn:</strong> <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem' }}>CHỜ ADMIN DUYỆT</span></div>
                </div>

                <button
                  disabled
                  style={{
                    width: '100%',
                    background: '#94a3b8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle size={16} /> Đã gửi đơn ứng tuyển
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                {/* Thông tin Gia sư tự động */}
                <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={tutorAvatar}
                    alt={tutorName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{tutorName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SĐT liên hệ: <strong>{tutorPhone || 'Chưa cập nhật'}</strong></div>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ Hồ sơ đã xác minh</span>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                    Thời gian có thể nhận lớp (Ngày & Giờ) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={availableFrom}
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                    Ghi chú cho Admin (Tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Ghi chú thêm về lịch dạy / kinh nghiệm..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={16} />
                  {submitting ? 'Đang gửi thông tin...' : 'XÁC NHẬN ĐĂNG KÝ NHẬN LỚP'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Section: Danh sách Gia sư đăng ký nhận lớp này */}
        <div style={{ marginTop: '28px', background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck className="text-primary" size={22} style={{ color: '#2563eb' }} />
            Danh sách Gia sư đăng ký nhận lớp này
          </h3>

          {!classDetail.applications || classDetail.applications.length === 0 ? (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
              Hiện tại chưa có Gia sư nào đăng ký nhận lớp này.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>STT</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>Gia sư ứng tuyển</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>Thời gian nhận lớp</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>Ghi chú</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {classDetail.applications.map((app, idx) => (
                    <tr key={app.application_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{idx + 1}</td>
                      <td style={{ padding: '10px', color: '#0f172a', fontWeight: '600' }}>
                        {app.tutor?.full_name || 'Gia sư'}
                      </td>
                      <td style={{ padding: '10px', color: '#334155' }}>{formatDateTime(app.available_from)}</td>
                      <td style={{ padding: '10px', color: '#64748b' }}>{app.notes || 'Không có'}</td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            background: app.status === 'APPROVED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                            color: app.status === 'APPROVED' ? '#15803d' : app.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                          }}
                        >
                          {app.status === 'APPROVED' ? 'ĐÃ CHỌN' : app.status === 'REJECTED' ? 'TỪ CHỐI' : 'CHỜ DUYỆT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>



      </div>
    </div>
  );
};

export default ClassDetailPage;
