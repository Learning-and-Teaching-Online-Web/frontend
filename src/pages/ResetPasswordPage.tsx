import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import authApi from '../services/authApi';
import '../styles/AuthPage.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.');
      return;
    }

    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      if (res.success) {
        setIsSuccess(true);
        toast.success('Đặt lại mật khẩu thành công!');
      } else {
        toast.error(res.error || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Đặt lại mật khẩu thất bại. Mã xác nhận có thể đã hết hạn (2 giờ).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Đặt lại mật khẩu</span>
        </div>
      </div>

      <div className="page-title-banner">
        <div className="container">
          <h1>Tạo Mật Khẩu Mới</h1>
        </div>
      </div>

      <div className="auth-page-container container">
        <div className="auth-card" style={{ padding: '40px' }}>
          {isSuccess ? (
            <div className="email-notice-card">
              <div className="email-notice-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className="auth-form-title" style={{ color: '#16a34a' }}>Đặt Lại Mật Khẩu Thành Công!</h2>
              <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>
                Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập với mật khẩu mới.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="auth-submit-btn"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="email-notice-icon" style={{ marginBottom: '12px' }}>
                  <KeyRound size={32} />
                </div>
                <h2 className="auth-form-title" style={{ marginBottom: '8px' }}>Đặt Lại Mật Khẩu</h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </p>
              </div>

              {!token && (
                <div className="auth-alert auth-alert-error" style={{ marginBottom: '20px' }}>
                  Liên kết không hợp lệ. Vui lòng kiểm tra lại đường dẫn từ email của bạn.
                </div>
              )}

              <div className="form-group">
                <label>Mật khẩu mới*</label>
                <div className="form-input-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới*</label>
                <div className="form-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={isLoading || !token}>
                {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
              </button>

              <div className="auth-footer-prompt">
                <Link to="/auth" className="auth-switch-link">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
