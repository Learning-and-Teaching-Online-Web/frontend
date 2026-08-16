import React, { useRef } from 'react';
import {
  User,
  BookOpen,
  Calendar,
  Award,
  Heart,
  ClipboardList,
  Settings,
  LogOut,
  Camera,
  Wallet
} from 'lucide-react';
import type { StudentProfile } from '../../data/mockStudentData';
import { authApi } from '../../services/authApi';
import { toast } from 'react-toastify';
import '../../styles/student/DashboardSidebar.css';

interface DashboardSidebarProps {
  profile: StudentProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: (e: React.MouseEvent) => void;
  quizCount: number;
  favoriteCount: number;
  classRequestCount?: number;
  handleAvatarFileChange?: (file: File) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  profile,
  activeTab,
  onTabChange,
  onLogout,
  quizCount,
  favoriteCount,
  classRequestCount = 0,
  handleAvatarFileChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (handleAvatarFileChange) {
      handleAvatarFileChange(file);
    }

    // Auto update avatar via API
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      try {
        const res = await authApi.updateProfile({ avatarUrl: base64Str });
        if (res && res.success) {
          window.dispatchEvent(new Event('authChange'));
          toast.success('Đã cập nhật ảnh đại diện thành công!');
        }
      } catch (err) {
        console.error('Error auto updating avatar:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Always format as "Học viên " + cleanFullName
  const rawName = profile.fullName || 'Học viên';
  const cleanName = rawName.replace(/^Học viên\s+/i, '').trim();
  const displayName = cleanName ? `Học viên ${cleanName}` : 'Học viên';

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        {/* Hidden File Input for Avatar Selection */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Clickable Avatar Container */}
        <div
          className="sidebar-avatar-wrapper"
          onClick={handleAvatarClick}
          title="Nhấp vào đây để đổi ảnh đại diện"
        >
          <div className="avatar-circle">
            <img
              src={profile.avatar}
              alt={displayName}
              className="sidebar-avatar-img"
            />
            <div className="sidebar-avatar-overlay">
              <Camera size={22} color="#ffffff" />
            </div>
          </div>
          <span className="sidebar-role-badge">HỌC VIÊN</span>
        </div>

        <h3>{displayName}</h3>
        <p>{profile.email}</p>
      </div>

      <ul className="sidebar-menu">
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => onTabChange('overview')}
          >
            <User size={18} />
            Tổng quan
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => onTabChange('courses')}
          >
            <BookOpen size={18} />
            Khóa học của tôi
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => onTabChange('schedule')}
          >
            <Calendar size={18} />
            Lịch học trực tuyến
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'class-requests' ? 'active' : ''}`}
            onClick={() => onTabChange('class-requests')}
          >
            <ClipboardList size={18} />
            Lớp học Offline {classRequestCount > 0 ? `(${classRequestCount})` : ''}
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => onTabChange('quizzes')}
          >
            <Award size={18} />
            Bài trắc nghiệm ({quizCount})
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => onTabChange('favorites')}
          >
            <Heart size={18} />
            Gia sư yêu thích ({favoriteCount})
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => onTabChange('wallet')}
          >
            <Wallet size={18} />
            Ví cá nhân (Nạp/Thanh toán)
          </button>
        </li>
        <li>
          <button
            className={`menu-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onTabChange('profile')}
          >
            <Settings size={18} />
            Cài đặt hồ sơ
          </button>
        </li>
        <li style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <button
            className="menu-item-btn"
            onClick={onLogout}
            style={{ color: '#ef4444' }}
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </li>
      </ul>
    </aside>
  );
};
