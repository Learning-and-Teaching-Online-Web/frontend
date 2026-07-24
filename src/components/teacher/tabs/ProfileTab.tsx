import React, { useState, useEffect } from 'react';
import { User, Award, Plus, Trash2, ExternalLink, Save, CheckCircle, Clock, XCircle, Camera } from 'lucide-react';

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
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(150000);
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [teachingMode, setTeachingMode] = useState<'online' | 'offline' | 'both'>('both');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  useEffect(() => {
    if (tutorProfile) {
      setBio(tutorProfile.bio || tutorProfile.user?.bio || '');
      setEducation(tutorProfile.education || '');
      setExperienceYears(tutorProfile.experience_years || 0);
      setHourlyRate(Number(tutorProfile.hourly_rate) || 150000);
      
      let specStr = '';
      if (Array.isArray(tutorProfile.specialties)) {
        specStr = tutorProfile.specialties.join(', ');
      } else if (typeof tutorProfile.specialties === 'string') {
        specStr = tutorProfile.specialties;
      }
      setSpecialtiesStr(specStr);
      setTeachingMode(tutorProfile.teaching_mode || 'both');
      setProvince(tutorProfile.province || '');
      setDistrict(tutorProfile.district || '');
    }
  }, [tutorProfile]);

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = specialtiesStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload: any = {
      bio,
      education,
      experience_years: Number(experienceYears),
      hourly_rate: Number(hourlyRate),
      specialties: specs,
      teaching_mode: teachingMode,
      province,
      district
    };

    if (avatarBase64) {
      payload.avatarUrl = avatarBase64;
    }

    handleUpdateProfileSubmit(payload);
  };

  const certificates = tutorProfile?.certificates || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* SECTION 1: PROFILE INFO FORM */}
      <div className="section-card">
        <div className="section-header">
          <h2><User size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#4f46e5' }} /> Thông tin cá nhân & Giảng dạy</h2>
        </div>

        <form onSubmit={onSaveProfile} className="db-form">
          {/* AVATAR UPLOAD SECTION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '16px 20px', background: 'var(--bg-dashboard)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarBase64 || tutorProfile?.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={tutorProfile?.user?.full_name || 'Giảng viên'}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #4f46e5' }}
              />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Ảnh đại diện Giảng viên</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-light)' }}>Chọn tệp hình ảnh (PNG, JPG, WEBP) từ máy tính của bạn</p>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#4f46e5',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                <Camera size={15} /> Đổi ảnh từ máy tính
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
          <div className="form-group-db">
            <label>Giới thiệu bản thân & Phương pháp giảng dạy (Bio) *</label>
            <textarea
              rows={4}
              required
              placeholder="Chia sẻ về quá trình học tập, kinh nghiệm và phương pháp giảng dạy giúp học viên đạt kết quả tốt nhất..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Trình độ học vấn / Trường tốt nghiệp *</label>
              <input
                type="text"
                required
                placeholder="VD: Cử nhân Sư phạm Toán - ĐH Sư Phạm Hà Nội"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Số năm kinh nghiệm dạy học *</label>
              <input
                type="number"
                min={0}
                max={50}
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Mức học phí theo giờ mong muốn (VND/giờ) *</label>
              <input
                type="number"
                step="20000"
                min={50000}
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            </div>

            <div className="form-group-db">
              <label>Hình thức giảng dạy *</label>
              <select value={teachingMode} onChange={(e: any) => setTeachingMode(e.target.value)}>
                <option value="both">Linh hoạt (Cả Online & Tại nhà)</option>
                <option value="online">Chỉ dạy Trực tuyến (Online)</option>
                <option value="offline">Chỉ dạy Trực tiếp (Offline)</option>
              </select>
            </div>
          </div>

          <div className="form-group-db">
            <label>Chuyên môn / Thế mạnh (Phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              placeholder="VD: Ôn thi Đại học 9+, Luyện thi IELTS 8.0, Toán Cấp 3, Lập trình ReactJS..."
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
            />
          </div>

          <div className="form-row-db">
            <div className="form-group-db">
              <label>Tỉnh / Thành phố (nhận dạy)</label>
              <input
                type="text"
                placeholder="VD: Hà Nội, TP. Hồ Chí Minh"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>

            <div className="form-group-db">
              <label>Quận / Huyện (nhận dạy)</label>
              <input
                type="text"
                placeholder="VD: Cầu Giấy, Quận 1"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
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
