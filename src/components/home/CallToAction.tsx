import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCheck, BookOpen } from 'lucide-react';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-banner-section-wrapper" style={{ padding: '20px 0' }}>
      <div className="container">
        <div className="cta-banner-section">
          <div className="cta-banner-container">
            {/* Left side: Icon & Title */}
            <div className="cta-left">
              <div className="cta-icon-circle">
                <GraduationCap size={28} />
              </div>
              <div>
                <h3 className="cta-title">Sẵn Sàng Bắt Đầu Học Tập Cùng NovaLearn?</h3>
                <p style={{ margin: '4px 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                  Đăng ký ngay để tìm gia sư giỏi nhất hoặc đăng ký giảng dạy để tăng thu nhập.
                </p>
              </div>
            </div>

            {/* Right side: Action buttons */}
            <div className="cta-right-btns">
              <button className="cta-student-btn" onClick={() => navigate('/tim-gia-su')}>
                <UserCheck size={16} style={{ marginRight: '6px' }} />
                Tìm gia sư ngay
              </button>
              <button className="cta-instructor-btn" onClick={() => navigate('/lop-hoc-moi')}>
                <BookOpen size={16} style={{ marginRight: '6px' }} />
                Dành cho gia sư
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
