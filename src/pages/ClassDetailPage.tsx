import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { toast } from 'react-toastify';
import { MapPin, UserCheck, Send, ArrowLeft } from 'lucide-react';



interface Application {
  application_id: string;
  applicant_phone: string;
  available_date?: string;
  notes?: string;
  status: string;
  created_at: string;
  tutor?: {
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [applicantPhone, setApplicantPhone] = useState('');
  const [timeOption, setTimeOption] = useState('Ngay lập tức');
  const [availableDate, setAvailableDate] = useState('');
  const [notes, setNotes] = useState('');

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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantPhone) {
      toast.error('Vui lòng nhập số điện thoại của bạn!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        applicant_phone: applicantPhone,
        available_date: `${timeOption} - ${availableDate || 'Linh hoạt'}`,
        notes,
      };

      const res = await axiosClient.post(`/class-requests/${id}/apply`, payload);
      toast.success(res.data.message || 'Đăng ký nhận lớp thành công!');

      
      // Clear form & refresh detail
      setApplicantPhone('');
      setAvailableDate('');
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
          MS: {classDetail.code} - Việc làm gia sư dạy môn {classDetail.subject_name} {classDetail.grade_level} {classDetail.district} {classDetail.province}
        </div>

        {/* Main Content Layout (Grid 2 Columns) */}
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
          
          {/* Left Column: Detail Info */}
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#1e293b' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Mã lớp:</strong> <span style={{ color: '#b45309', fontWeight: '700' }}>{classDetail.code}</span>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Lớp dạy:</strong> {classDetail.grade_level}
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
              <strong>Liên hệ trung tâm:</strong> {classDetail.phone || '0974.502.420 - 0938.708.488'}
            </p>
          </div>

          {/* Right Column: ĐĂNG KÝ NHANH FORM Box */}
          <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0e7490', margin: '0 0 14px 0', textAlign: 'center', textTransform: 'uppercase' }}>
              ĐĂNG KÝ NHANH
            </h3>
            
            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                  Nhập số điện thoại của bạn (*)
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="Nhập số điện thoại..."
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                  Thời gian có thể nhận lớp
                </label>
                <select
                  value={timeOption}
                  onChange={(e) => setTimeOption(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                >
                  <option value="Ngay lập tức">Ngay lập tức</option>
                  <option value="Trong 1-2 ngày">Trong 1-2 ngày</option>
                  <option value="Trong tuần này">Trong tuần này</option>
                  <option value="Thỏa thuận sau">Thỏa thuận sau</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                  Thời gian nhận lớp cụ thể
                </label>
                <input
                  type="text"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  placeholder="VD: Chiều T2 hoặc Ngày 05/08..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#155e75', marginBottom: '4px' }}>
                  Yêu cầu thêm (nếu có)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ghi chú kinh nghiệm / trình độ..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #67e8f9', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Send size={16} />
                {submitting ? 'Đang gửi...' : 'Ứng tuyển nhận lớp'}
              </button>
            </form>
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
                    <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1' }}>Gia sư / SĐT</th>
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
                        {app.tutor?.full_name || 'Gia sư'} ({app.applicant_phone})
                      </td>
                      <td style={{ padding: '10px', color: '#334155' }}>{app.available_date || 'N/A'}</td>
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

        {/* Bottom Policy Guidance */}
        <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb', fontSize: '0.88rem', color: '#1e40af', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700' }}>
            HỢP TÁC GIỚI THIỆU LỚP MỚI CHO TRUNG TÂM, BẠN SẼ NHẬN ĐƯỢC 60% LỆ PHÍ LỚP MỚI
          </p>
          <p style={{ margin: 0 }}>
            Lưu ý: Trung tâm cam kết thu phí nhận lớp đúng quy định ({classDetail.commission_rate}%). Gia sư vui lòng đọc kĩ quy trình nhận lớp trước khi đăng ký nhận dạy.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ClassDetailPage;
