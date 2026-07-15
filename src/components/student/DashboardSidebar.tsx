import React from 'react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Award, 
  Heart, 
  Settings, 
  LogOut 
} from 'lucide-react';
import type { StudentProfile } from '../../data/mockStudentData';
import '../../styles/student/DashboardSidebar.css';

interface DashboardSidebarProps {
  profile: StudentProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: (e: React.MouseEvent) => void;
  quizCount: number;
  favoriteCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  profile,
  activeTab,
  onTabChange,
  onLogout,
  quizCount,
  favoriteCount
}) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar-wrapper">
          <img 
            src={profile.avatar} 
            alt={profile.fullName} 
            className="sidebar-avatar"
          />
          <span className="sidebar-role-badge">Học viên</span>
        </div>
        <h3>{profile.fullName}</h3>
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
            Giảng viên yêu thích ({favoriteCount})
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
