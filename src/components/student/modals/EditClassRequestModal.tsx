import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, BookOpen, MapPin, Phone, Mail, User, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import type { StudentClassRequest } from '../tabs/ClassRequestsTab';
import { formatInputNumber, parseInputNumber } from '../../../utils/formatters';

interface EditClassRequestModalProps {
  item: StudentClassRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_LIST = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const START_TIMES = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
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

export const EditClassRequestModal: React.FC<EditClassRequestModalProps> = ({
  item,
  onClose,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [gradeList, setGradeList] = useState<{ grade_id: string; name: string }[]>([]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isCustomSubjectActive, setIsCustomSubjectActive] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState<string>('');

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');

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
    selected_tutor_code: '',
    desired_price: '',
    other_requirements: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resS, resG] = await Promise.all([
          axiosClient.get('/subjects'),
          axiosClient.get('/grades'),
        ]);
        const sItems = resS.data?.data || (Array.isArray(resS.data) ? resS.data : []);
        const names = sItems.map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
        setSubjectList(names);

        const gItems = resG.data?.data || (Array.isArray(resG.data) ? resG.data : []);
        if (Array.isArray(gItems) && gItems.length > 0) {
          setGradeList(gItems);
        }
      } catch (err) {
        console.error('Error fetching modal options:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!item) return;

    const initialSubject = item.subject_name || '';
    const initialGrade = item.grade_level || 'Lớp 9';

    setFormData({
      student_name: item.student_name || '',
      phone: item.phone || '',
      email: item.email || '',
      address_detail: item.address_detail || '',
      district: item.district || '',
      province: item.province || 'Hồ Chí Minh',
      grade_level: initialGrade,
      subject_name: initialSubject,
      num_students: item.num_students || 1,
      academic_level: item.academic_level || '',
      sessions_per_week: item.sessions_per_week || 2,
      study_time: item.study_time || '',
      tutor_requirement: item.tutor_requirement || 'Sinh viên',
      selected_tutor_code: item.selected_tutor_code || '',
      desired_price: formatInputNumber(item.desired_price || 0),
      other_requirements: (item as any).other_requirements || '',
    });

    if (initialSubject) {
      setSelectedSubjects([initialSubject]);
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'sessions_per_week') {
      const newSessions = Number(value);
      setFormData((prev) => ({ ...prev, sessions_per_week: newSessions }));
      if (selectedDays.length > newSessions) {
        const trimmed = selectedDays.slice(0, newSessions);
        setSelectedDays(trimmed);
        updateStudyTimeCombined(trimmed, startTime, formData.tutor_requirement);
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTutorReqChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const req = e.target.value;
    setFormData((prev) => ({ ...prev, tutor_requirement: req }));
    updateStudyTimeCombined(selectedDays, startTime, req);
  };

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects([]);
      setIsCustomSubjectActive(false);
      setFormData((prev) => ({ ...prev, subject_name: '' }));
    } else {
      setSelectedSubjects([sub]);
      setIsCustomSubjectActive(false);
      setCustomSubject('');
      setFormData((prev) => ({ ...prev, subject_name: sub }));
    }
  };

  const toggleCustomSubjectActive = () => {
    if (isCustomSubjectActive) {
      setIsCustomSubjectActive(false);
      setFormData((prev) => ({ ...prev, subject_name: '' }));
    } else {
      setSelectedSubjects([]);
      setIsCustomSubjectActive(true);
      setFormData((prev) => ({ ...prev, subject_name: customSubject }));
    }
  };

  const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomSubject(val);
    if (isCustomSubjectActive) {
      setFormData((prev) => ({ ...prev, subject_name: val }));
    }
  };

  const toggleDay = (day: string) => {
    const targetSessions = Number(formData.sessions_per_week) || 1;
    if (selectedDays.includes(day)) {
      const nextDays = selectedDays.filter((d) => d !== day);
      setSelectedDays(nextDays);
      updateStudyTimeCombined(nextDays, startTime, formData.tutor_requirement);
    } else {
      if (selectedDays.length >= targetSessions) {
        toast.warning(`Số buổi/tuần là ${targetSessions} buổi. Bạn chỉ được chọn tối đa ${targetSessions} ngày học!`);
        return;
      }
      const nextDays = [...selectedDays, day];
      setSelectedDays(nextDays);
      updateStudyTimeCombined(nextDays, startTime, formData.tutor_requirement);
    }
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
      setFormData((prev) => ({ ...prev, study_time: daysStr || prev.study_time }));
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

    const numPrice = parseInputNumber(formData.desired_price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Vui lòng nhập mức học phí hợp lệ (> 0 VNĐ)');
      return;
    }

    setSubmitting(true);

    try {
      const reqId = item.request_id || item.class_id;
      const payload: any = {
        ...formData,
        desired_price: numPrice,
        num_students: Number(formData.num_students) || 1,
        sessions_per_week: Number(formData.sessions_per_week) || 2,
      };

      if (item.status === 'REJECTED') {
        payload.status = 'PENDING_ADMIN';
      }

      const res = await axiosClient.patch(`/class-requests/my-requests/${reqId}`, payload);
      toast.success(res.data.message || 'Cập nhật bài đăng thành công!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating request:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật bài đăng.');
    } finally {
      setSubmitting(false);
    }
  };

  const isRejected = item.status === 'REJECTED';
  const adminNote = (item as any).admin_note;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '760px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          background: isRejected ? 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={22} />
              {isRejected ? 'Sửa & Gửi Lại Bài Đăng Cho Admin Duyệt' : 'Chỉnh Sửa Thông Tin Yêu Cầu Tìm Gia Sư'}
            </h3>
            <span style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '2px', display: 'block' }}>
              MS: {item.code || item.class_code || item.request_id?.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Rejection Banner */}
        {isRejected && (
          <div style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '14px 24px' }}>
            <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={18} color="#dc2626" />
              Lý do bài đăng bị Admin từ chối trước đó:
            </div>
            <p style={{ color: '#7f1d1d', fontSize: '0.88rem', margin: 0, fontWeight: 500, lineHeight: '1.4' }}>
              {adminNote || 'Không có ghi chú cụ thể. Vui lòng kiểm tra kỹ lại thông tin học phí, môn học và địa chỉ trước khi gửi lại.'}
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Họ tên */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Họ tên học viên <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên..."
                  required
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* SĐT */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Điện thoại liên hệ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại..."
                  required
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Địa chỉ email..."
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Tỉnh / Thành */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Tỉnh / Thành phố <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
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
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Địa chỉ chi tiết (Số nhà, Đường, Quận/Huyện) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tỉnh lộ 43, Bình Chiểu, Q.Thủ Đức..."
                  required
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Lớp học */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Khối / Lớp học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                {gradeList.map((g) => (
                  <option key={g.grade_id || g.name} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Môn học */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Môn học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {subjectList.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#2563eb' : '#475569',
                        fontWeight: isSelected ? '700' : '500',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? `✓ ${sub}` : sub}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={toggleCustomSubjectActive}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: isCustomSubjectActive ? '1px solid #ea580c' : '1px solid #cbd5e1',
                    background: isCustomSubjectActive ? '#fff7ed' : '#ffffff',
                    color: isCustomSubjectActive ? '#ea580c' : '#475569',
                    fontWeight: isCustomSubjectActive ? '700' : '500',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {isCustomSubjectActive ? '✓ Khác...' : '+ Môn khác'}
                </button>
              </div>

              {isCustomSubjectActive && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={handleCustomSubjectChange}
                  placeholder="Nhập môn học khác..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ea580c', fontSize: '0.9rem', outline: 'none', marginBottom: '6px', boxSizing: 'border-box' }}
                />
              )}

              {formData.subject_name && (
                <div style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', fontSize: '0.82rem', color: '#1e293b' }}>
                  Môn đã chọn: <strong style={{ color: '#2563eb' }}>{formData.subject_name}</strong>
                </div>
              )}
            </div>

            {/* Số lượng học sinh */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Số lượng học sinh <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                name="num_students"
                value={formData.num_students}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Học lực */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Học lực hiện tại
              </label>
              <input
                type="text"
                name="academic_level"
                value={formData.academic_level}
                onChange={handleChange}
                placeholder="Ví dụ: Khá, Yếu môn Toán..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Số buổi / tuần */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Số buổi / tuần <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="sessions_per_week"
                value={formData.sessions_per_week}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value={1}>1 buổi / tuần</option>
                <option value={2}>2 buổi / tuần</option>
                <option value={3}>3 buổi / tuần</option>
                <option value={4}>4 buổi / tuần</option>
                <option value={5}>5 buổi / tuần</option>
                <option value={6}>6 buổi / tuần</option>
              </select>
            </div>

            {/* Yêu cầu gia sư */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Yêu cầu gia sư <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="tutor_requirement"
                value={formData.tutor_requirement}
                onChange={handleTutorReqChange}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
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

            {/* Thời gian học */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Thời gian học mong muốn <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {DAYS_LIST.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#2563eb' : '#475569',
                          fontWeight: isSelected ? '700' : '500',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected ? `✓ ${day}` : day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <select
                    value={startTime}
                    onChange={handleStartTimeChange}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Chọn giờ bắt đầu --</option>
                    {START_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    readOnly
                    value={startTime ? calculateEndTime(startTime, getSessionDuration(formData.tutor_requirement)) : ''}
                    placeholder="Giờ kết thúc tự động"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#f8fafc', color: '#1e293b', fontWeight: '600', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {formData.study_time && (
                <input
                  type="text"
                  name="study_time"
                  value={formData.study_time}
                  onChange={handleChange}
                  placeholder="Hoặc tự nhập mô tả thời gian..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', marginTop: '8px', boxSizing: 'border-box' }}
                />
              )}
            </div>

            {/* Mức học phí */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b', fontSize: '0.88rem' }}>
                Mức học phí mong muốn (VNĐ / tháng) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="desired_price"
                  value={formData.desired_price}
                  onChange={(e) => {
                    const formatted = formatInputNumber(e.target.value);
                    setFormData((prev) => ({ ...prev, desired_price: formatted }));
                  }}
                  placeholder="Ví dụ: 2.000.000..."
                  required
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', fontWeight: '700', color: '#059669', boxSizing: 'border-box' }}
                />
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
              </div>
            </div>

            {/* GS Chỉ định */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Mã gia sư chỉ định (Nếu có)
              </label>
              <input
                type="text"
                name="selected_tutor_code"
                value={formData.selected_tutor_code}
                onChange={handleChange}
                placeholder="Ví dụ: 7650..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Ghi chú khác */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#334155', fontSize: '0.88rem' }}>
                Yêu cầu khác / Ghi chú
              </label>
              <textarea
                name="other_requirements"
                value={formData.other_requirements}
                onChange={handleChange}
                rows={2}
                placeholder="Các ghi chú khác..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '9px 18px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '9px 24px',
                background: isRejected ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isRejected ? '0 4px 12px rgba(220, 38, 38, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Send size={16} />
              {submitting ? 'Đang gửi...' : isRejected ? 'Lưu & Gửi Lại Duyệt →' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
