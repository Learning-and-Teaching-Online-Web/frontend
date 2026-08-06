import React, { useState, useEffect } from 'react';
import { User, Award, Plus, Trash2, ExternalLink, Save, CheckCircle, Clock, XCircle, Camera } from 'lucide-react';
import { formatInputNumber, formatMoneyString } from '../../../utils/formatters';

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
      teaching_mode: teachingMode
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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
