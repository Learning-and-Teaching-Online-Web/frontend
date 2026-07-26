import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { authApi } from '../../services/authApi';
import authStorage from '../../utils/authStorage';
import { toast } from 'react-toastify';
import '../../styles/admin/AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.login({ email, password });

      const user = res.metadata?.user || res.user || res.data?.user;
      const token = res.data?.session?.access_token;
      const userRole = user?.user_metadata?.role || user?.role;

      if (userRole !== 'admin') {
        toast.error('Tài khoản không có quyền quản trị viên!');
        setIsLoading(false);
        return;
      }

      const userName = user?.user_metadata?.full_name || user?.fullName || user?.email?.split('@')[0] || 'Admin';

      // Save admin session in authStorage
      authStorage.setAuthSession(token, userRole, userName);

      window.dispatchEvent(new Event('authChange'));
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Portal</h2>
          <p>Đăng nhập vào hệ thống quản trị</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>© 2026 E-Learning Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
