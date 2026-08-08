import React, { useState, useEffect } from 'react';
import { User, Award, Plus, Trash2, ExternalLink, Save, CheckCircle, Clock, XCircle, Camera, BookOpen } from 'lucide-react';
import { formatInputNumber, formatMoneyString } from '../../../utils/formatters';
import tutorApi from '../../../services/tutorApi';

interface ProfileTabProps {
  tutorProfile: any | null;
  handleUpdateProfileSubmit: (data: any) => Promise<void>;
  openAddCertModal: () => void;
  handleDeleteCert: (certId: string, title: string) => Promise<void>;
  formatVND?: (n: number) => string;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  tutorProfile,
  handleUpdateProfileSubmit,
  openAddCertModal,
  handleDeleteCert
}) => {
  // Form fields aligned 100% with DB TutorProfile model
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [currentRole, setCurrentRole] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState<number | ''>('');
  const [hometown, setHometown] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [minSalaryRequirement, setMinSalaryRequirement] = useState('');
  const [teachingMode, setTeachingMode] = useState<'online' | 'offline' | 'both'>('both');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [idCardFrontBase64, setIdCardFrontBase64] = useState<string | null>(null);

  // Grades state
  const [availableGrades, setAvailableGrades] = useState<any[]>([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([]);

  // Tutor Available Times state (7 days x 3 slots)
  const [selectedAvailableTimes, setSelectedAvailableTimes] = useState<{ day_of_week: string; time_slot: string }[]>([]);

  const DAYS_OF_WEEK = [
    { key: 'mon', label: 'Thứ 2' },
    { key: 'tue', label: 'Thứ 3' },
    { key: 'wed', label: 'Thứ 4' },
    { key: 'thu', label: 'Thứ 5' },
    { key: 'fri', label: 'Thứ 6' },
    { key: 'sat', label: 'Thứ 7' },
    { key: 'sun', label: 'Chủ Nhật' },
  ];

  const TIME_SLOTS = [
    { key: 'morning', label: 'Sáng (07:00 - 12:00)' },
    { key: 'afternoon', label: 'Chiều (13:00 - 17:00)' },
    { key: 'evening', label: 'Tối (18:00 - 22:00)' },
  ];

  const toggleAvailableTime = (dayKey: string, slotKey: string) => {
    setSelectedAvailableTimes(prev => {
      const exists = prev.some(item => item.day_of_week === dayKey && item.time_slot === slotKey);
      if (exists) {
        return prev.filter(item => !(item.day_of_week === dayKey && item.time_slot === slotKey));
      } else {
        return [...prev, { day_of_week: dayKey, time_slot: slotKey }];
      }
    });
  };

  useEffect(() => {
    tutorApi.getAllGrades().then(res => {
      if (res?.success && Array.isArray(res.data)) {
        setAvailableGrades(res.data);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (tutorProfile) {
      setFullName(tutorProfile.full_name || tutorProfile.user?.full_name || '');
      setPhone(tutorProfile.phone || '');

      let dobStr = '';
      if (tutorProfile.date_of_birth) {
        const d = new Date(tutorProfile.date_of_birth);
        if (!isNaN(d.getTime())) {
          dobStr = d.toISOString().split('T')[0];
        }
      }
      setDateOfBirth(dobStr);
      setGender(tutorProfile.gender || 'male');
      setCurrentRole(tutorProfile.current_role || '');
      setUniversity(tutorProfile.university || '');
      setMajor(tutorProfile.major || '');
      setGraduationYear(tutorProfile.graduation_year || '');
      setHometown(tutorProfile.hometown || '');
      setCurrentAddress(tutorProfile.current_address || '');
      setExperienceYears(tutorProfile.experience_years || 0);
      setMinSalaryRequirement(tutorProfile.min_salary_requirement ? formatMoneyString(tutorProfile.min_salary_requirement, '') : '');
      setTeachingMode(tutorProfile.teaching_mode || 'both');
      setIdCardFrontBase64(tutorProfile.id_card_front_url || null);

      if (Array.isArray(tutorProfile.grades)) {
        const ids = tutorProfile.grades.map((g: any) => g.grade_id || g.grade?.grade_id).filter(Boolean);
        setSelectedGradeIds(ids);
      }

      if (Array.isArray(tutorProfile.available_times)) {
        const times = tutorProfile.available_times.map((t: any) => ({
          day_of_week: t.day_of_week,
          time_slot: t.time_slot
        }));
        setSelectedAvailableTimes(times);
      }
    }
  }, [tutorProfile]);

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      fullName,
      phone,
      dateOfBirth,
      gender,
      currentRole,
      university,
      major,
      graduationYear: graduationYear ? Number(graduationYear) : undefined,
      hometown,
      currentAddress,
      experience_years: Number(experienceYears),
      minSalaryRequirement,
      teaching_mode: teachingMode,
      grade_ids: selectedGradeIds,
      available_times: selectedAvailableTimes
    };

    if (avatarBase64) {
      payload.avatarUrl = avatarBase64;
    }

    if (idCardFrontBase64) {
      payload.id_card_front_url = idCardFrontBase64;
    }

    handleUpdateProfileSubmit(payload);
  };

  const certificates = tutorProfile?.certificates || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

      {/* SECTION 1: PROFILE INFO FORM (MATCHING DATABASE COLUMNS) */}
      <div className="section-card">
        <div className="section-header">
          <h2><User size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#4f46e5' }} /> Thông tin cá nhân & Hồ sơ Gia sư</h2>
        </div>

        <form onSubmit={onSaveProfile} className="db-form">
          {/* AVATAR & CCCD UPLOAD SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Avatar Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--bg-dashboard)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={avatarBase64 || tutorProfile?.avatar_url || tutorProfile?.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={fullName || 'Giảng viên'}
                  style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #4f46e5' }}
                />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-dark)', fontWeight: 600 }}>Ảnh đại diện Gia sư</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-light)' }}>Định dạng PNG, JPG, WEBP</p>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: '#4f46e5',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  <Camera size={14} /> Tải ảnh chân dung
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setAvatarBase64(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* CCCD Front Photo Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--bg-dashboard)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ flexShrink: 0, width: '100px', height: '65px', borderRadius: '8px', border: '2px dashed #cbd5e1', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {idCardFrontBase64 ? (
                  <img
                    src={idCardFrontBase64}
                    alt="CCCD mặt trước"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', padding: '4px', fontWeight: 600 }}>
                    Chưa có ảnh CCCD
                  </div>
                )}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-dark)', fontWeight: 600 }}>Ảnh CCCD mặt trước</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-light)' }}>Xác thực thông tin định danh với Admin</p>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: '#0284c7',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  <Camera size={14} /> Tải ảnh CCCD mặt trước
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setIdCardFrontBase64(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields Mapping 1-to-1 with TutorProfile Schema */}
          <div className="form-row-db">
            <div className="form-group-db">
              <label>Họ và tên đầy đủ *</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn Thầy"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Số điện thoại liên hệ</label>
              <input
                type="text"
                placeholder="VD: 0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Ngày tháng năm sinh</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Giới tính</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Hiện là *</label>
              <input
                type="text"
                required
                placeholder="VD: Cử Nhân, Giáo Viên, Sinh Viên, Kỹ Sư..."
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Trường đại học / cao đẳng *</label>
              <input
                type="text"
                required
                placeholder="VD: Đại học Sư Phạm Hà Nội, ĐH Nông Lâm..."
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Chuyên ngành đào tạo *</label>
              <input
                type="text"
                required
                placeholder="VD: Sư phạm Toán, Quản trị kinh doanh..."
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Năm tốt nghiệp</label>
              <input
                type="number"
                placeholder="VD: 2023"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Nguyên quán (Tỉnh / Thành)</label>
              <input
                type="text"
                placeholder="VD: Hà Nội, Nam Định..."
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Địa chỉ hiện tại / Khu vực nhận dạy</label>
              <input
                type="text"
                placeholder="VD: Quận 1, Q.Thủ Đức, Q.Bình Thạnh..."
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Số năm kinh nghiệm dạy học (năm) *</label>
              <input
                type="number"
                min={0}
                max={50}
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>

            <div className="form-group-db">
              <label>Yêu cầu lương tối thiểu *</label>
              <input
                type="text"
                required
                placeholder="VD: 230.000 VNĐ hoặc 150.000 VNĐ/giờ"
                value={minSalaryRequirement}
                onChange={(e) => {
                  const val = e.target.value;
                  const formatted = formatInputNumber(val);
                  setMinSalaryRequirement(formatted ? `${formatted} VNĐ` : val);
                }}
              />
            </div>
          </div>

          <div className="form-group-db">
            <label>Hình thức giảng dạy *</label>
            <select value={teachingMode} onChange={(e: any) => setTeachingMode(e.target.value)}>
              <option value="both">Linh hoạt (Cả Trực tuyến & Tại nhà)</option>
              <option value="online">Chỉ dạy Trực tuyến (Online)</option>
              <option value="offline">Chỉ dạy Trực tiếp (Offline / Tại nhà)</option>
            </select>
          </div>

          {/* KHỐI LỚP NHẬN DẠY (TUTOR_GRADES) */}
          <div className="form-group-db" style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <BookOpen size={16} style={{ color: '#4f46e5' }} /> Khối lớp nhận dạy
            </label>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-light)' }}>
              Tích chọn các khối lớp bạn có khả năng giảng dạy tốt nhất để học sinh và phụ huynh dễ dàng tìm thấy bạn.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
              padding: '12px',
              background: 'var(--bg-dashboard, #f8fafc)',
              borderRadius: '8px',
              border: '1px solid var(--border-light, #e2e8f0)'
            }}>
              {availableGrades.map((g: any) => {
                const isChecked = selectedGradeIds.includes(g.grade_id);
                return (
                  <label
                    key={g.grade_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: isChecked ? 600 : 400,
                      color: isChecked ? '#4f46e5' : 'var(--text-dark)',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGradeIds(prev => [...prev, g.grade_id]);
                        } else {
                          setSelectedGradeIds(prev => prev.filter(id => id !== g.grade_id));
                        }
                      }}
                      style={{ accentColor: '#4f46e5', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {g.name}
                  </label>
                );
              })}
              {availableGrades.length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-light)', gridColumn: '1 / -1' }}>
                  Đang tải danh sách khối lớp...
                </div>
              )}
            </div>
          </div>

          {/* LỊCH RẢNH GIẢNG DẠY (TUTOR_AVAILABLE_TIMES) */}
          <div className="form-group-db" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <Clock size={16} style={{ color: '#4f46e5' }} /> Lịch rảnh có thể giảng dạy
            </label>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-light)' }}>
              Tick chọn các khung giờ bạn sẵn sàng nhận lớp trong tuần để hệ thống gợi ý lớp phù hợp nhất.
            </p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-light, #e2e8f0)', borderRadius: '8px', background: 'var(--bg-dashboard, #f8fafc)', padding: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(79, 70, 229, 0.08)', borderBottom: '1px solid var(--border-light, #cbd5e1)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: '#334155' }}>Ca học / Ngày</th>
                    {DAYS_OF_WEEK.map(d => (
                      <th key={d.key} style={{ padding: '10px', fontWeight: 600, color: '#4f46e5' }}>{d.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(slot => (
                    <tr key={slot.key} style={{ borderBottom: '1px solid var(--border-light, #f1f5f9)' }}>
                      <td style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: '#475569', background: 'rgba(255,255,255,0.5)' }}>{slot.label}</td>
                      {DAYS_OF_WEEK.map(day => {
                        const isSelected = selectedAvailableTimes.some(t => t.day_of_week === day.key && t.time_slot === slot.key);
                        return (
                          <td
                            key={day.key}
                            onClick={() => toggleAvailableTime(day.key, slot.key)}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => { }}
                              style={{ accentColor: '#4f46e5', width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn-primary-db">
              <Save size={16} /> Lưu thay đổi hồ sơ
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: CERTIFICATES MANAGEMENT */}
      <div className="section-card">
        <div className="section-header">
          <h2><Award size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#4f46e5' }} /> Chứng chỉ & Bằng cấp chuyên môn</h2>
          <button className="btn-primary-db" onClick={openAddCertModal}>
            <Plus size={16} /> Gửi chứng chỉ mới
          </button>
        </div>

        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>Tên bằng cấp / Chứng chỉ</th>
                <th>Nơi cấp</th>
                <th>Tệp scan / Ảnh</th>
                <th>Trạng thái xét duyệt</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert: any) => (
                <tr key={cert.cert_id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{cert.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                      {cert.issued_date ? `Ngày cấp: ${new Date(cert.issued_date).toLocaleDateString('vi-VN')}` : ''}
                    </div>
                  </td>
                  <td>{cert.issued_by || 'Chưa ghi rõ'}</td>
                  <td>
                    {cert.file_url ? (
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#4f46e5', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                      >
                        Xem file <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>Không có</span>
                    )}
                  </td>
                  <td>
                    {cert.status === 'approved' && (
                      <span className="badge badge-confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669' }}>
                        <CheckCircle size={12} /> Đã duyệt
                      </span>
                    )}
                    {cert.status === 'pending' && (
                      <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Đang chờ duyệt
                      </span>
                    )}
                    {cert.status === 'rejected' && (
                      <div>
                        <span className="badge badge-cancelled" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={12} /> Từ chối
                        </span>
                        {cert.admin_note && (
                          <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontStyle: 'italic' }}>
                            Lý do: {cert.admin_note}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="actions-group" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn-action-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => handleDeleteCert(cert.cert_id, cert.title)}
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                    Bạn chưa tải lên bằng cấp hoặc chứng chỉ nào. Hãy bấm "Gửi chứng chỉ mới" để tăng độ tin cậy đối với học sinh và được Admin phê duyệt tài khoản nhanh chóng!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
