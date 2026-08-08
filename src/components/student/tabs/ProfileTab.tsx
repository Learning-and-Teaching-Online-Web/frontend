import React, { useState, useEffect } from 'react';
import { Save, Camera } from 'lucide-react';
import type { StudentProfile } from '../../../data/mockStudentData';
import tutorApi from '../../../services/tutorApi';
import '../../../styles/student/ProfileTab.css';

interface ProfileTabProps {
  profile: StudentProfile;
  formState: {
    formName: string;
    formPhone: string;
    formGender: string;
    formDateOfBirth: string;
    formGrade: string;
    formAcademicLevel: string;
    formProvince: string;
    formDistrict: string;
    formAddressDetail: string;
  };
  formSetters: {
    setFormName: (v: string) => void;
    setFormPhone: (v: string) => void;
    setFormGender: (v: string) => void;
    setFormDateOfBirth: (v: string) => void;
    setFormGrade: (v: string) => void;
    setFormAcademicLevel: (v: string) => void;
    setFormProvince: (v: string) => void;
    setFormDistrict: (v: string) => void;
    setFormAddressDetail: (v: string) => void;
  };
  handlers: {
    handleProfileSubmit: (e: React.FormEvent) => void;
    handleAvatarFileChange?: (file: File) => void;
  };
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  formState,
  formSetters,
  handlers
}) => {
  const [gradesList, setGradesList] = useState<{ grade_id: string; name: string }[]>([]);

  useEffect(() => {
    tutorApi.getAllGrades().then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setGradesList(res.data);
      }
    }).catch(console.error);
  }, []);
  return (
    <div>
      <div className="content-header">
        <h2>Cài đặt hồ sơ học viên</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Cập nhật thông tin cá nhân và trình độ học vấn của bạn</span>
      </div>

      <form onSubmit={handlers.handleProfileSubmit}>
        {/* AVATAR UPLOAD SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '16px 20px', background: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={profile.fullName}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-dark)' }}>Ảnh đại diện tài khoản</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-muted)' }}>Chọn tệp hình ảnh (PNG, JPG, WEBP) từ máy tính của bạn</p>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'var(--primary)',
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
                  if (file && handlers.handleAvatarFileChange) {
                    handlers.handleAvatarFileChange(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="profile-form-grid">
          {/* 1. Full Name */}
          <div className="profile-form-group">
            <label htmlFor="fullName">Họ và tên *</label>
            <input 
              type="text" 
              id="fullName"
              className="profile-form-input" 
              value={formState.formName}
              onChange={(e) => formSetters.setFormName(e.target.value)}
              required
            />
          </div>

          {/* 2. Email */}
          <div className="profile-form-group">
            <label htmlFor="email">Email (Không được thay đổi)</label>
            <input 
              type="email" 
              id="email"
              className="profile-form-input" 
              value={profile.email} 
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: 'var(--text-light)' }}
            />
          </div>

          {/* 3. Phone */}
          <div className="profile-form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input 
              type="text" 
              id="phone"
              className="profile-form-input" 
              value={formState.formPhone}
              onChange={(e) => formSetters.setFormPhone(e.target.value)}
              placeholder="VD: 0987654321..."
            />
          </div>

          {/* 4. Gender */}
          <div className="profile-form-group">
            <label htmlFor="gender">Giới tính</label>
            <select 
              id="gender"
              className="profile-form-select"
              value={formState.formGender}
              onChange={(e) => formSetters.setFormGender(e.target.value)}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* 5. Date of Birth */}
          <div className="profile-form-group">
            <label htmlFor="dateOfBirth">Ngày tháng năm sinh</label>
            <input 
              type="date" 
              id="dateOfBirth"
              className="profile-form-input" 
              value={formState.formDateOfBirth}
              onChange={(e) => formSetters.setFormDateOfBirth(e.target.value)}
            />
          </div>

          {/* 6. Grade Level */}
          <div className="profile-form-group">
            <label htmlFor="gradeLevel">Trình độ học vấn / Khối lớp</label>
            <select 
              id="gradeLevel"
              className="profile-form-select"
              value={formState.formGrade}
              onChange={(e) => formSetters.setFormGrade(e.target.value)}
            >
              {gradesList.map((g) => (
                <option key={g.grade_id || g.name} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Academic Level */}
          <div className="profile-form-group">
            <label htmlFor="academicLevel">Học lực hiện tại</label>
            <select 
              id="academicLevel"
              className="profile-form-select"
              value={formState.formAcademicLevel}
              onChange={(e) => formSetters.setFormAcademicLevel(e.target.value)}
            >
              <option value="Giỏi">Giỏi / Xuất sắc</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Mất gốc / Yếu</option>
            </select>
          </div>

          {/* 8. Province */}
          <div className="profile-form-group">
            <label htmlFor="province">Tỉnh / Thành phố</label>
            <input 
              type="text" 
              id="province"
              className="profile-form-input" 
              value={formState.formProvince}
              onChange={(e) => formSetters.setFormProvince(e.target.value)}
              placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
            />
          </div>

          {/* 9. District */}
          <div className="profile-form-group">
            <label htmlFor="district">Quận / Huyện</label>
            <input 
              type="text" 
              id="district"
              className="profile-form-input" 
              value={formState.formDistrict}
              onChange={(e) => formSetters.setFormDistrict(e.target.value)}
              placeholder="VD: Cầu Giấy, Quận 1..."
            />
          </div>

          {/* 10. Address Detail */}
          <div className="profile-form-group full-width">
            <label htmlFor="addressDetail">Địa chỉ chi tiết (Số nhà, tên đường, phường/xã)</label>
            <input 
              type="text" 
              id="addressDetail"
              className="profile-form-input" 
              value={formState.formAddressDetail}
              onChange={(e) => formSetters.setFormAddressDetail(e.target.value)}
              placeholder="VD: Số 12, ngõ 34, đường Nguyễn Trãi, Phường Thanh Xuân Trung..."
            />
          </div>
        </div>

        <button type="submit" className="btn-save-profile">
          <Save size={16} />
          Lưu thay đổi hồ sơ
        </button>
      </form>
    </div>
  );
};
