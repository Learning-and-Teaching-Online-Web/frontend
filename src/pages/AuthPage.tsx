import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { authApi } from '../services/authApi';
import authStorage from '../utils/authStorage';
import '../styles/AuthPage.css';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

type Gender = 'male' | 'female' | 'other';
type Role = 'student' | 'tutor';

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialMode);

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

  // Register success notice screen state
  const [registeredEmailNotice, setRegisteredEmailNotice] = useState<string | null>(null);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);

  // Google Role Modal state
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [googleSignupData, setGoogleSignupData] = useState<{ email: string; fullName: string; googleId: string } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Parse URL search params for OAuth responses & verification flags
  useEffect(() => {
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    const googleSuccess = searchParams.get('google_success');
    const googleSignup = searchParams.get('google_signup');
    const errorParam = searchParams.get('error');

    if (verified === 'true') {
      toast.success('Kích hoạt tài khoản thành công! Vui lòng đăng nhập.');
      setActiveTab('login');
    }

    if (reset === 'true') {
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
      setActiveTab('login');
    }

    if (googleSuccess === 'true') {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const role = searchParams.get('role') || 'student';
      const fullName = searchParams.get('fullName') || 'Google User';

      if (token && refreshToken) {
        authStorage.setAuthSession(token, refreshToken, role, fullName);
        window.dispatchEvent(new Event('authChange'));
        toast.success('Đăng nhập bằng Google thành công!');

        if (role === 'admin') navigate('/admin');
        else if (role === 'tutor') navigate('/teacher/dashboard');
        else navigate('/');
      }
    }

    if (googleSignup === 'true') {
      const email = searchParams.get('email') || '';
      const fullName = searchParams.get('fullName') || '';
      const googleId = searchParams.get('googleId') || '';

      setGoogleSignupData({ email, fullName, googleId });
      setShowGoogleRoleModal(true);
    }

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
    }
  }, [searchParams, navigate]);

  const handleTabSwitch = (tab: 'login' | 'register' | 'forgot') => {
    setActiveTab(tab);
    setRegisteredEmailNotice(null);
    setForgotSuccessMessage(null);
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
      const response = await authApi.login({
        email: loginIdentifier,
        password: loginPassword,
      });

      const user = response?.data?.user;
      const token = response?.data?.access_token;
      const refreshToken = response?.data?.refresh_token;
      const role = user?.role || 'student';
      const fullName = user?.full_name || loginIdentifier.split('@')[0];

      authStorage.setAuthSession(token, refreshToken, role, fullName);

      window.dispatchEvent(new Event('authChange'));
      toast.success('Đăng nhập thành công!');

      if (role === 'admin') navigate('/admin');
      else if (role === 'tutor') navigate('/teacher/dashboard');
      else navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
      const response = await authApi.register({
        email: registerEmail,
        password: registerPassword,
        fullName: registerFullName,
        phone: registerPhone,
        gender: registerGender,
        dateOfBirth: registerDateOfBirth,
        role: registerRole
      });

      if (response.success) {
        setRegisteredEmailNotice(registerEmail);
        toast.success(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email kích hoạt.');
      } else {
        toast.error(response.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      toast.error('Vui lòng nhập địa chỉ Email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(forgotEmail.trim());
      setForgotSuccessMessage(res.message || 'Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.');
      toast.success('Đã gửi email khôi phục mật khẩu!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleCompleteGoogleSignup = async (selectedRole: 'student' | 'tutor') => {
    if (!googleSignupData) return;

    setIsLoading(true);
    try {
      const res = await authApi.completeGoogleSignup({
        email: googleSignupData.email,
        fullName: googleSignupData.fullName,
        googleId: googleSignupData.googleId,
        role: selectedRole
      });

      if (res.success) {
        const user = res.data?.user;
        const token = res.data?.access_token;
        const refreshToken = res.data?.refresh_token;
        const role = user?.role || selectedRole;
        const fullName = user?.full_name || googleSignupData.fullName;

        authStorage.setAuthSession(token, refreshToken, role, fullName);
        window.dispatchEvent(new Event('authChange'));
        setShowGoogleRoleModal(false);
        toast.success('Đăng ký tài khoản bằng Google thành công!');

        if (role === 'tutor') navigate('/teacher/dashboard');
        else navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Hoàn tất đăng ký Google thất bại.');
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
          <span className="breadcrumbs-current">
            {activeTab === 'login' ? 'Đăng nhập' : activeTab === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}
          </span>
        </div>
      </div>

      {/* 2. Page Title Banner */}
      <div className="page-title-banner">
        <div className="container">
          <h1>
            {activeTab === 'login' ? 'Đăng nhập' : activeTab === 'register' ? 'Đăng ký Tài Khoản' : 'Khôi Phục Mật Khẩu'}
          </h1>
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

            {registeredEmailNotice ? (
              /* REGISTER NOTICE SCREEN */
              <div className="email-notice-card">
                <div className="email-notice-icon">
                  <Mail size={36} />
                </div>
                <h2 className="auth-form-title" style={{ color: '#2563eb' }}>Kiểm Tra Hộp Thư Email</h2>
                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Hệ thống đã gửi một liên kết kích hoạt đến email: <br />
                  <strong style={{ color: '#1d4ed8' }}>{registeredEmailNotice}</strong>
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                  Vui lòng kiểm tra hộp thư của bạn và nhấn vào link kích hoạt (có hiệu lực trong <strong>24 giờ</strong>) để hoàn tất đăng ký và bắt đầu đăng nhập.
                </p>
                <button
                  onClick={() => handleTabSwitch('login')}
                  className="auth-submit-btn"
                >
                  Đồng ý, Chuyển tới Đăng nhập
                </button>
              </div>
            ) : activeTab === 'forgot' ? (
              /* FORGOT PASSWORD FORM */
              <form onSubmit={handleForgotSubmit} noValidate>
                <h2 className="auth-form-title">Quên Mật Khẩu</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                  Nhập địa chỉ email đăng ký của bạn. Hệ thống sẽ gửi một liên kết để tạo lại mật khẩu mới (có hiệu lực trong 2 giờ).
                </p>

                {forgotSuccessMessage ? (
                  <div className="auth-alert auth-alert-success" style={{ marginBottom: '20px' }}>
                    <CheckCircle2 size={20} className="auth-alert-icon" />
                    <span>{forgotSuccessMessage}</span>
                  </div>
                ) : (
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Nhập Email của bạn"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                {!forgotSuccessMessage && (
                  <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
                  </button>
                )}

                <div className="auth-footer-prompt">
                  Nhớ mật khẩu?
                  <span
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Đăng nhập ngay
                  </span>
                </div>
              </form>
            ) : activeTab === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} noValidate>
                <h2 className="auth-form-title">Đăng nhập</h2>

                {/* Google Sign-in Button */}
                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Tiếp tục với Google
                </button>

                <div className="social-divider">
                  <span>HOẶC</span>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Email"
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
                      placeholder="Mật khẩu"
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
                      handleTabSwitch('forgot');
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

                {/* Google Sign-in Button */}
                <button
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleLogin}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Đăng ký nhanh với Google
                </button>

                <div className="social-divider">
                  <span>HOẶC</span>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Họ và tên"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Số điện thoại"
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
                    placeholder="Ngày sinh"
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
                    <option value="tutor">Gia sư</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-input-wrapper">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Mật khẩu"
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
                      placeholder="Xác nhận mật khẩu"
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

      {/* Google Signup Role Selection Modal */}
      {showGoogleRoleModal && (
        <div className="modal-overlay">
          <div className="role-modal">
            <h2 className="role-modal-title">Chọn Vai Trò Của Bạn</h2>
            <p className="role-modal-subtitle">
              Chào mừng <strong>{googleSignupData?.fullName}</strong>! Vui lòng chọn vai trò sử dụng tài khoản Gia Sư Online:
            </p>

            <div className="role-options-grid">
              <div
                className="role-option-card"
                onClick={() => handleCompleteGoogleSignup('student')}
              >
                <div className="role-option-icon">🎓</div>
                <div className="role-option-label">Học Viên</div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Tìm kiếm gia sư & khóa học</span>
              </div>

              <div
                className="role-option-card"
                onClick={() => handleCompleteGoogleSignup('tutor')}
              >
                <div className="role-option-icon">👨‍🏫</div>
                <div className="role-option-label">Gia Sư</div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Tạo khóa học & giảng dạy</span>
              </div>
            </div>

            <button
              onClick={() => setShowGoogleRoleModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Hủy đăng ký
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
