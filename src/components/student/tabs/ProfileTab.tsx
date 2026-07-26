import React from 'react';
import { Save, Camera } from 'lucide-react';
import type { StudentProfile } from '../../../data/mockStudentData';
import '../../../styles/student/ProfileTab.css';

interface ProfileTabProps {
  profile: StudentProfile;
  formState: {
    formName: string;
    formPhone: string;
    formGrade: string;
    formGoals: string;
    formSubjects: string[];
    formMode: 'online' | 'offline' | 'both';
    formBudgetMax: number;
  };
  formSetters: {
    setFormName: (v: string) => void;
    setFormPhone: (v: string) => void;
    setFormGrade: (v: string) => void;
    setFormGoals: (v: string) => void;
    setFormSubjects: (v: string[]) => void;
    setFormMode: (v: 'online' | 'offline' | 'both') => void;
    setFormBudgetMax: (v: number) => void;
  };
  handlers: {
    handleProfileSubmit: (e: React.FormEvent) => void;
    handleSubjectCheckbox: (subject: string) => void;
    handleAvatarFileChange?: (file: File) => void;
  };
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  formState,
  formSetters,
  handlers
}) => {
  return (
    <div>
      <div className="content-header">
        <h2>Cài đặt hồ sơ học viên</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Cập nhật thông tin lớp học và mục tiêu học tập để tìm giảng viên phù hợp</span>
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

          <div className="profile-form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input 
              type="text" 
              id="phone"
              className="profile-form-input" 
              value={formState.formPhone}
              onChange={(e) => formSetters.setFormPhone(e.target.value)}
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="gradeLevel">Trình độ học vấn</label>
            <select 
              id="gradeLevel"
              className="profile-form-select"
              value={formState.formGrade}
              onChange={(e) => formSetters.setFormGrade(e.target.value)}
            >
              <option value="Lớp 10">Lớp 10</option>
              <option value="Lớp 11">Lớp 11</option>
              <option value="Lớp 12">Lớp 12</option>
              <option value="Đại học">Đại học</option>
              <option value="Khác">Khác / Người đi làm</option>
            </select>
          </div>

          <div className="profile-form-group">
            <label htmlFor="preferredMode">Hình thức học mong muốn</label>
            <select 
              id="preferredMode"
              className="profile-form-select"
              value={formState.formMode}
              onChange={(e) => formSetters.setFormMode(e.target.value as 'online' | 'offline' | 'both')}
            >
              <option value="online">Học trực tuyến (Online)</option>
              <option value="offline">Học trực tiếp (Offline)</option>
              <option value="both">Cả hai hình thức</option>
            </select>
          </div>

          <div className="profile-form-group">
            <label htmlFor="budgetMax">Học phí tối đa mong muốn (VNĐ/giờ)</label>
            <input 
              type="number" 
              id="budgetMax"
              step="50000"
              min="50000"
              className="profile-form-input" 
              value={formState.formBudgetMax}
              onChange={(e) => formSetters.setFormBudgetMax(Number(e.target.value))}
            />
          </div>

          <div className="profile-form-group full-width">
            <label>Môn học quan tâm học tập</label>
            <div className="profile-checkbox-group">
              {['Photography', 'Design', 'Office', 'Academy', 'University'].map(subj => (
                <label key={subj} className="profile-checkbox-label">
                  <input 
                    type="checkbox"
                    checked={formState.formSubjects.includes(subj)}
                    onChange={() => handlers.handleSubjectCheckbox(subj)}
                  />
                  <span>{subj}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-form-group full-width">
            <label htmlFor="learningGoals">Mục tiêu học tập cá nhân</label>
            <textarea 
              id="learningGoals"
              className="profile-form-textarea" 
              placeholder="Mục tiêu cụ thể như thi lấy chứng chỉ, cải thiện kỹ năng Photoshop..."
              value={formState.formGoals}
              onChange={(e) => formSetters.setFormGoals(e.target.value)}
            ></textarea>
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
