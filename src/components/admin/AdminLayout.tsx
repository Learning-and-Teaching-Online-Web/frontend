import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/admin/AdminLayout.css';
import { toast } from 'react-toastify';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  const userRole = localStorage.getItem('userRole');

  // Security check - Must be logged in as admin
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated || userRole !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang quản trị!');
      navigate('/auth');
    }
  }, [navigate, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChange'));
    toast.success('Đăng xuất tài khoản quản trị thành công!');
    navigate('/auth');
  };

  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>{title}</h1>
          </div>
          
          <div className="admin-user-profile">
            <div className="admin-user-info">
              <span className="admin-username">{userName}</span>
              <span className="admin-userrole">Quản trị viên</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
              alt="Admin Avatar" 
              className="admin-avatar" 
            />
          </div>
        </header>

        <main className="admin-page-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
