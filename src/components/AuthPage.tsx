import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import '../styles/AuthPage.css';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

type Gender = 'male' | 'female' | 'other';

type Role = 'student' | 'tutor';

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerGender, setRegisterGender] = useState<Gender>('male');
  const [registerDateOfBirth, setRegisterDateOfBirth] = useState('');
  const [registerRole, setRegisterRole] = useState<Role>('student');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginIdentifier.trim()) {
      toast.error('Vui lòng nhập Email.');
      return;
    }
    if (!loginPassword) {
      toast.error('Vui lòng nhập Mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.login({
        email: loginIdentifier,
        password: loginPassword,
      });
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerEmail.trim()) {
      toast.error('Vui lòng nhập Email.');
      return;
    }
    // Simple Email Regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      toast.error('Định dạng Email không hợp lệ.');
      return;
    }

    if (!registerFullName.trim()) {
      toast.error('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!registerPhone.trim()) {
      toast.error('Vui lòng nhập Số điện thoại.');
      return;
    }
    if (!registerDateOfBirth) {
      toast.error('Vui lòng nhập Ngày sinh.');
      return;
    }
    if (!registerPassword) {
      toast.error('Vui lòng nhập Mật khẩu.');
      return;
    }
    if (registerPassword.length < 6) {
      toast.error('Mật khẩu đăng ký phải có ít nhất 6 ký tự.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        email: registerEmail,
        password: registerPassword,
        fullName: registerFullName,
        phone: registerPhone,
        gender: registerGender,
        dateOfBirth: registerDateOfBirth,
        role: registerRole
      });
      toast.success('Đăng ký tài khoản thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Đăng nhập / Đăng ký</span>
        </div>
      </div>

      {/* 2. Page Title Banner */}
      <div className="page-title-banner">
        <div className="container">
          <h1>Đăng nhập / Đăng ký</h1>
        </div>
      </div>

      {/* 3. Auth Page Container */}
      <div className="auth-page-container container">
        <div className="auth-card">

          {/* Card Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('register')}
            >
              Đăng ký
            </button>
          </div>

          {/* Form Content */}
          <div className="auth-form-container">

            {activeTab === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} noValidate>
                <h2 className="auth-form-title">Đăng nhập</h2>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Email hoặc Tên đăng nhập*"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-input-wrapper">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Mật khẩu*"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a
                    href="#"
                    className="lost-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Tính năng khôi phục mật khẩu đang được phát triển.');
                    }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>

                <div className="auth-footer-prompt">
                  Chưa có tài khoản?
                  <span
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('register')}
                  >
                    Đăng ký
                  </span>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} noValidate>
                <h2 className="auth-form-title">Đăng ký</h2>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Email*"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Họ và tên*"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Số điện thoại*"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                  <select
                    className="form-input"
                    value={registerGender}
                    onChange={(e) => setRegisterGender(e.target.value as Gender)}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  <input
                    type="date"
                    className="form-input"
                    placeholder="Ngày sinh*"
                    value={registerDateOfBirth}
                    onChange={(e) => setRegisterDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    className="form-input"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as Role)}
                  >
                    <option value="student">Học viên</option>
                    <option value="tutor">Giảng viên</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-input-wrapper">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Mật khẩu*"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      aria-label={showRegisterPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-input-wrapper">
                    <input
                      type={showRegisterConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Xác nhận mật khẩu*"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      aria-label={showRegisterConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>

                <div className="auth-footer-prompt">
                  Đã có tài khoản?
                  <span
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Đăng nhập
                  </span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
