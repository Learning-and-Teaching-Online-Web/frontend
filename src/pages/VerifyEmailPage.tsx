import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import authApi from '../services/authApi';
import '../styles/AuthPage.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Mã xác minh không tồn tại trong liên kết.');
      return;
    }

    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        if (res.success) {
          setStatus('success');
          toast.success(res.message || 'Xác minh tài khoản thành công!');
        } else {
          setStatus('error');
          setErrorMessage(res.error || 'Xác minh tài khoản thất bại.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error || 'Liên kết xác minh không hợp lệ hoặc đã hết hạn (24 giờ).');
      }
    };

    verify();
  }, [token]);

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      toast.error('Vui lòng nhập email của bạn.');
      return;
    }

    setIsResending(true);
    try {
      const res = await authApi.resendVerification(resendEmail.trim());
      toast.success(res.message || 'Đã gửi lại email kích hoạt. Vui lòng kiểm tra hộp thư.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Gửi lại email thất bại. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Xác minh Email</span>
        </div>
      </div>

      <div className="page-title-banner">
        <div className="container">
          <h1>Xác Minh Tài Khoản Email</h1>
        </div>
      </div>

      <div className="auth-page-container container">
        <div className="auth-card" style={{ padding: '40px 30px' }}>
          {status === 'loading' && (
            <div className="email-notice-card">
              <div className="email-notice-icon">
                <Loader2 size={36} className="animate-spin" />
              </div>
              <h2 className="auth-form-title">Đang xác minh email...</h2>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                Vui lòng đợi trong giây lát, hệ thống đang kiểm tra mã xác thực của bạn.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="email-notice-card">
              <div className="email-notice-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className="auth-form-title" style={{ color: '#16a34a' }}>Xác Minh Thành Công!</h2>
              <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>
                Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn đã có thể đăng nhập và trải nghiệm các dịch vụ của Gia Sư Online.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="auth-submit-btn"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="email-notice-card">
              <div className="email-notice-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                <XCircle size={40} />
              </div>
              <h2 className="auth-form-title" style={{ color: '#dc2626' }}>Xác Minh Thất Bại</h2>
              <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>
                {errorMessage}
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                Yêu cầu gửi lại email kích hoạt:
              </h3>
              <form onSubmit={handleResendSubmit}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Nhập địa chỉ Email của bạn*"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="auth-submit-btn" disabled={isResending}>
                  {isResending ? 'Đang gửi...' : 'Gửi lại email xác minh'}
                </button>
              </form>

              <div className="auth-footer-prompt" style={{ marginTop: '20px' }}>
                <Link to="/auth" className="auth-switch-link">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
