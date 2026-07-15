import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/AuthPage.css';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  
  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    resetMessages();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!loginIdentifier.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Tên đăng nhập.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập Mật khẩu.');
      return;
    }

    // Mock success
    setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
    // Clear inputs
    setLoginIdentifier('');
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!registerEmail.trim()) {
      setErrorMsg('Vui lòng nhập Email.');
      return;
    }
    // Simple Email Regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      setErrorMsg('Định dạng Email không hợp lệ.');
      return;
    }

    if (!registerUsername.trim()) {
      setErrorMsg('Vui lòng nhập Tên đăng nhập.');
      return;
    }
    if (!registerPassword) {
      setErrorMsg('Vui lòng nhập Mật khẩu.');
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMsg('Mật khẩu đăng ký phải có ít nhất 6 ký tự.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Mock success
    setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
    // Switch to login tab after brief delay or clear inputs
    setRegisterEmail('');
    setRegisterUsername('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    
    setTimeout(() => {
      setActiveTab('login');
      resetMessages();
    }, 2000);
  };

  return (
    <div className="auth-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Homepage</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Login / Register</span>
        </div>
      </div>

      {/* 2. Page Title Banner */}
      <div className="page-title-banner">
        <div className="container">
          <h1>Login / Register</h1>
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
              Login
            </button>
            <button 
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('register')}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="auth-form-container">
            {errorMsg && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle className="auth-alert-icon" size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="auth-alert auth-alert-success">
                <CheckCircle2 className="auth-alert-icon" size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} noValidate>
                <h2 className="auth-form-title">Login</h2>
                
                <div className="form-group">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Email or username*" 
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
                      placeholder="Password*" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
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
                    <span>Remember me</span>
                  </label>
                  <a 
                    href="#" 
                    className="lost-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setErrorMsg('Tính năng khôi phục mật khẩu đang được phát triển.');
                    }}
                  >
                    Lost your password?
                  </a>
                </div>

                <button type="submit" className="auth-submit-btn">
                  Login
                </button>

                <div className="auth-footer-prompt">
                  Don't have an account? 
                  <span 
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('register')}
                  >
                    Register
                  </span>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} noValidate>
                <h2 className="auth-form-title">Register</h2>

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
                    placeholder="Username*" 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-input-wrapper">
                    <input 
                      type={showRegisterPassword ? 'text' : 'password'} 
                      className="form-input" 
                      placeholder="Password*" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
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
                      placeholder="Confirm Password*" 
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      aria-label={showRegisterConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn">
                  Register
                </button>

                <div className="auth-footer-prompt">
                  Already have an account? 
                  <span 
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Login
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
