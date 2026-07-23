import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  LogOut, 
  ArrowLeft 
} from 'lucide-react';

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Thống kê', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/students', label: 'Học viên', icon: <Users size={20} /> },
    { path: '/admin/tutors', label: 'Giảng viên', icon: <GraduationCap size={20} /> },
    { path: '/admin/courses', label: 'Khóa học', icon: <BookOpen size={20} /> },
    { path: '/admin/payouts', label: 'Giao dịch & Rút tiền', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <span>Admin Panel</span>
      </div>

      <div className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <button onClick={onLogout} className="admin-logout-btn">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
