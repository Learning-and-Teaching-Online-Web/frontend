import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import authStorage from '../utils/authStorage';
import { toast } from 'react-toastify';
import { Send, DollarSign, MapPin, Phone, Mail, User, ShieldAlert, LogIn, BookOpen } from 'lucide-react';

const DAYS_LIST = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const START_TIMES = [
  '07:00', '07:30',
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30',
];

const getSessionDuration = (tutorReq: string): number => {
  return tutorReq.includes('Giáo viên') ? 90 : 120;
};

const calculateEndTime = (start: string, durationMinutes: number): string => {
  if (!start) return '';
  const parts = start.split(':');
  if (parts.length < 2) return '';
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return '';

  const totalMins = hours * 60 + minutes + durationMinutes;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;

  const hStr = endH.toString().padStart(2, '0');
  const mStr = endM.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
};

const RequestTutorPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const isAuthenticated = authStorage.isAuthenticated();
  const userRole = authStorage.getUserRole();

  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isCustomSubjectActive, setIsCustomSubjectActive] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState<string>('');

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await axiosClient.get('/subjects');
        const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        const names = items
          .map((s: any) => (typeof s === 'string' ? s : s.name))
          .filter(Boolean);
        setSubjectList(names);
      } catch (err) {
        console.error('Error fetching subjects from database:', err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

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

  const handleTutorReqChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const req = e.target.value;
    setFormData((prev) => ({ ...prev, tutor_requirement: req }));
    updateStudyTimeCombined(selectedDays, startTime, req);
  };

  const toggleSubject = (sub: string) => {
    const nextSubjects = selectedSubjects.includes(sub)
      ? selectedSubjects.filter((s) => s !== sub)
      : [...selectedSubjects, sub];
    setSelectedSubjects(nextSubjects);
    updateSubjectNameStr(nextSubjects, isCustomSubjectActive, customSubject);
  };

  const toggleCustomSubjectActive = () => {
    const nextActive = !isCustomSubjectActive;
    setIsCustomSubjectActive(nextActive);
    updateSubjectNameStr(selectedSubjects, nextActive, customSubject);
  };

  const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomSubject(val);
    updateSubjectNameStr(selectedSubjects, isCustomSubjectActive, val);
  };

  const updateSubjectNameStr = (subjects: string[], customActive: boolean, customVal: string) => {
    const list = [...subjects];
    if (customActive && customVal.trim()) {
      list.push(customVal.trim());
    }
    const combined = list.join(', ');
    setFormData((prev) => ({ ...prev, subject_name: combined }));
  };

  const toggleDay = (day: string) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(nextDays);
    updateStudyTimeCombined(nextDays, startTime, formData.tutor_requirement);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const start = e.target.value;
    setStartTime(start);
    updateStudyTimeCombined(selectedDays, start, formData.tutor_requirement);
  };

  const updateStudyTimeCombined = (days: string[], start: string, tutorReq: string) => {
    const sortedDays = DAYS_LIST.filter((d) => days.includes(d));
    const daysStr = sortedDays.join(' - ');

    if (!start) {
      setFormData((prev) => ({ ...prev, study_time: daysStr }));
      return;
    }

    const duration = getSessionDuration(tutorReq);
    const endTime = calculateEndTime(start, duration);
    const timeFormatted = `${start} - ${endTime}`;

    const fullStr = daysStr ? `${daysStr} (${timeFormatted})` : timeFormatted;
    setFormData((prev) => ({ ...prev, study_time: fullStr }));
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

        {/* Guard 1: Must be authenticated */}
        {!isAuthenticated ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', background: '#ffffff' }}>
            <LogIn size={52} style={{ color: '#2563eb', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              Vui lòng đăng nhập để đăng bài tìm gia sư
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Bạn cần có tài khoản Học viên trên hệ thống để gửi yêu cầu tìm gia sư và theo dõi tiến độ xếp lớp.
            </p>
            <Link
              to="/auth"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <LogIn size={18} /> Đăng nhập ngay
            </Link>
          </div>
        ) : userRole === 'tutor' ? (
          /* Guard 2: Tutor cannot post request */
          <div style={{ padding: '48px 24px', textAlign: 'center', background: '#ffffff' }}>
            <ShieldAlert size={52} style={{ color: '#eab308', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              Tài khoản Gia sư không thể tạo bài tìm gia sư
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Tính năng này dành riêng cho Học viên / Phụ huynh. Bạn có thể xem danh sách các lớp học mới chưa giao để đăng ký nhận lớp dạy.
            </p>
            <Link
              to="/lop-hoc-moi"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: '#dc2626',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
            >
              <BookOpen size={18} /> Xem Lớp Offline
            </Link>
          </div>
        ) : (
          /* Student or Admin Form Body */
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

              {/* Môn học (Có thể chọn nhiều môn) */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>
                  Môn học <span style={{ color: '#ef4444' }}>*</span> <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '0.82rem' }}>(Có thể chọn nhiều môn học)</span>
                </label>

                {loadingSubjects ? (
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic', padding: '8px 0' }}>
                    Đang tải danh sách môn học từ hệ thống...
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                      {subjectList.map((sub) => {
                        const isSelected = selectedSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSubject(sub)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '20px',
                              border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                              background: isSelected ? '#eff6ff' : '#ffffff',
                              color: isSelected ? '#2563eb' : '#475569',
                              fontWeight: isSelected ? '700' : '500',
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.15)' : 'none',
                            }}
                          >
                            {isSelected ? `✓ ${sub}` : sub}
                          </button>
                        );
                      })}

                      {/* Nút Chọn Môn Khác */}
                      <button
                        type="button"
                        onClick={toggleCustomSubjectActive}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          border: isCustomSubjectActive ? '1px solid #ea580c' : '1px solid #cbd5e1',
                          background: isCustomSubjectActive ? '#fff7ed' : '#ffffff',
                          color: isCustomSubjectActive ? '#ea580c' : '#475569',
                          fontWeight: isCustomSubjectActive ? '700' : '500',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isCustomSubjectActive ? '✓ Khác...' : '+ Môn khác'}
                      </button>
                    </div>

                    {/* Input nhập môn khác */}
                    {isCustomSubjectActive && (
                      <input
                        type="text"
                        value={customSubject}
                        onChange={handleCustomSubjectChange}
                        placeholder="Nhập môn học khác (Ví dụ: Tiếng Pháp, Đàn Piano...)..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ea580c', fontSize: '0.95rem', outline: 'none', marginBottom: '8px' }}
                      />
                    )}

                    {/* Hiển thị danh sách môn đã chọn */}
                    {formData.subject_name && (
                      <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#1e293b' }}>
                        <strong>Các môn đã chọn:</strong> <span style={{ color: '#2563eb', fontWeight: '600' }}>{formData.subject_name}</span>
                      </div>
                    )}
                  </div>
                )}
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
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#334155', fontSize: '0.9rem' }}>
                  Thời gian học mong muốn <span style={{ color: '#ef4444' }}>*</span>
                </label>

                {/* Chọn thứ trong tuần */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                    Chọn các ngày học trong tuần:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {DAYS_LIST.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '20px',
                            border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            color: isSelected ? '#2563eb' : '#475569',
                            fontWeight: isSelected ? '700' : '500',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.15)' : 'none',
                          }}
                        >
                          {isSelected ? `✓ ${day}` : day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chọn khung giờ */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                        Giờ bắt đầu học:
                      </span>
                      <select
                        value={startTime}
                        onChange={handleStartTimeChange}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
                      >
                        <option value="">-- Chọn giờ bắt đầu --</option>
                        {START_TIMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                        Giờ kết thúc (Tự động tính):
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={startTime ? calculateEndTime(startTime, getSessionDuration(formData.tutor_requirement)) : ''}
                        placeholder="Chờ chọn giờ bắt đầu..."
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#f8fafc', color: '#1e293b', fontWeight: '600', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Thông báo quy định thời lượng */}
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      background: formData.tutor_requirement.includes('Giáo viên') ? '#fff7ed' : '#eff6ff',
                      color: formData.tutor_requirement.includes('Giáo viên') ? '#c2410c' : '#1d4ed8',
                      border: formData.tutor_requirement.includes('Giáo viên') ? '1px solid #ffedd5' : '1px solid #dbeafe',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}>
                      ⏱️ Quy định thời lượng: {getSessionDuration(formData.tutor_requirement)} phút / buổi ({formData.tutor_requirement.includes('Giáo viên') ? 'Giáo viên = 90p' : 'Sinh viên = 120p'})
                    </span>
                  </div>
                </div>

                {/* Hiển thị tổng hợp thời gian */}
                {formData.study_time && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#1e293b' }}>
                    <strong>Thời gian sẽ lưu:</strong> <span style={{ color: '#2563eb', fontWeight: '600' }}>{formData.study_time}</span>
                  </div>
                )}
              </div>

              {/* Yêu cầu gia sư */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.9rem' }}>
                  Yêu cầu gia sư <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="tutor_requirement"
                  value={formData.tutor_requirement}
                  onChange={handleTutorReqChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', outline: 'none' }}
                >
                  <option value="Sinh viên">Sinh viên (120 phút)</option>
                  <option value="Nữ Sinh Viên">Nữ Sinh Viên (120 phút)</option>
                  <option value="Nam Sinh Viên">Nam Sinh Viên (120 phút)</option>
                  <option value="Giáo viên">Giáo viên (90 phút)</option>
                  <option value="Nữ Giáo Viên">Nữ Giáo Viên (90 phút)</option>
                  <option value="Nam Giáo Viên">Nam Giáo Viên (90 phút)</option>
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
        )}
      </div>
    </div>
  );
};

export default RequestTutorPage;
