import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { toast } from 'react-toastify';
import { Send, DollarSign, MapPin, Phone, Mail, User } from 'lucide-react';



const RequestTutorPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    student_name: '',
    phone: '',
    email: '',
    address_detail: '',
    district: '',
    province: 'Hồ Chí Minh',
    grade_level: 'Lớp 9',
    subject_name: '',
    num_students: 1,
    academic_level: '',
    sessions_per_week: 2,
    study_time: '',
    tutor_requirement: 'Sinh viên',
    selected_tutor_id: '',
    desired_price: '',
    other_requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_name || !formData.phone || !formData.address_detail || !formData.subject_name || !formData.desired_price) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        desired_price: typeof formData.desired_price === 'number'
          ? formData.desired_price
          : Number(String(formData.desired_price || 0).replace(/[^0-9.]/g, '')) || 0,
        num_students: Number(formData.num_students) || 1,
        sessions_per_week: Number(formData.sessions_per_week) || 2,
      };

      const res = await axiosClient.post('/class-requests', payload);
      toast.success(res.data.message || 'Đăng ký tìm gia sư thành công!');

      navigate('/lop-hoc-moi');
    } catch (err: any) {
      console.error('Error submitting request:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Có lỗi xảy ra khi đăng ký tìm gia sư.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {/* Header Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', padding: '30px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ĐĂNG KÝ TÌM GIA SƯ
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
            Trung tâm Tư vấn Giáo dục & Dịch thuật Gia sư Thành Được - Cam kết gia sư uy tín chất lượng
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '32px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Họ tên */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Họ tên học viên / phụ huynh <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên..."
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Điện thoại */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Điện thoại liên hệ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0974502420..."
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email..."
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Tỉnh / Thành phố */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Tỉnh / Thành phố <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
              >
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Khác">Tỉnh thành khác</option>
              </select>
            </div>

            {/* Địa chỉ chi tiết */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã, Quận/Huyện) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleChange}
                  placeholder="Ví dụ: tỉnh lộ 43 - Bình Chiểu - Q.Thủ Đức..."
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
                />
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Lớp học */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Lớp học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
              >
                <option value="Lớp 1">Lớp 1</option>
                <option value="Lớp 2">Lớp 2</option>
                <option value="Lớp 3">Lớp 3</option>
                <option value="Lớp 4">Lớp 4</option>
                <option value="Lớp 5">Lớp 5</option>
                <option value="Lớp 6">Lớp 6</option>
                <option value="Lớp 7">Lớp 7</option>
                <option value="Lớp 8">Lớp 8</option>
                <option value="Lớp 9">Lớp 9</option>
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12</option>
                <option value="Luyện thi ĐH">Luyện Thi Đại Học</option>
                <option value="Ngoại ngữ">Ngoại Ngữ / Tin Học</option>
              </select>
            </div>

            {/* Môn học */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Môn học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="subject_name"
                value={formData.subject_name}
                onChange={handleChange}
                placeholder="Ví dụ: Toán, Lý, Hóa, Tiếng Anh..."
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Số lượng học sinh */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Số lượng học sinh <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                name="num_students"
                value={formData.num_students}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Học lực hiện tại */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Học lực hiện tại của học sinh
              </label>
              <input
                type="text"
                name="academic_level"
                value={formData.academic_level}
                onChange={handleChange}
                placeholder="Ví dụ: Yếu, Trung bình, Nam học giỏi..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Số buổi / tuần */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Số buổi / tuần <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="sessions_per_week"
                value={formData.sessions_per_week}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
              >
                <option value={1}>1 buổi / tuần</option>
                <option value={2}>2 buổi / tuần</option>
                <option value={3}>3 buổi / tuần</option>
                <option value={4}>4 buổi / tuần</option>
                <option value={5}>5 buổi / tuần</option>
                <option value={6}>6 buổi / tuần</option>
              </select>
            </div>

            {/* Thời gian học */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Thời gian học mong muốn <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="study_time"
                value={formData.study_time}
                onChange={handleChange}
                placeholder="Ví dụ: T2 - T4, 17h - 19h..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Yêu cầu gia sư */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Yêu cầu gia sư <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="tutor_requirement"
                value={formData.tutor_requirement}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
              >
                <option value="Sinh viên">Sinh viên</option>
                <option value="Nữ Sinh Viên">Nữ Sinh Viên</option>
                <option value="Nam Sinh Viên">Nam Sinh Viên</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Nữ Giáo Viên">Nữ Giáo Viên</option>
                <option value="Nam Giáo Viên">Nam Giáo Viên</option>
                <option value="Tùy trung tâm tư vấn">Tùy trung tâm tư vấn</option>
              </select>
            </div>

            {/* Giá tiền mong muốn */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b', fontSize: '0.9rem' }}>
                Mức lương / Giá tiền mong muốn (VNĐ / tháng) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  name="desired_price"
                  value={formData.desired_price}
                  onChange={handleChange}
                  placeholder="Ví dụ: 2000000..."
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', fontWeight: '600', color: '#059669' }}
                />
                <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
              </div>
            </div>

            {/* Mã số gia sư đã chọn (nếu có) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Mã số gia sư đã chọn (Nếu có chọn trước gia sư trên website)
              </label>
              <input
                type="text"
                name="selected_tutor_id"
                value={formData.selected_tutor_id}
                onChange={handleChange}
                placeholder="Ví dụ: Mã số 7650, 2907..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                * Nếu điền mã gia sư, trung tâm sẽ chủ động liên hệ làm việc riêng với gia sư đó xem có nhận lớp hay không.
              </span>
            </div>

            {/* Yêu cầu khác */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                Ghi chú / Yêu cầu khác
              </label>
              <textarea
                name="other_requirements"
                value={formData.other_requirements}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập thêm chi tiết các yêu cầu cụ thể khác nếu có..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 40px',
                fontSize: '1.05rem',
                fontWeight: '700',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Send size={18} />
              {submitting ? 'Đang gửi thông tin...' : 'ĐĂNG KÝ TÌM GIA SƯ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestTutorPage;
