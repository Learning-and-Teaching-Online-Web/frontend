import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, BookOpen, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/lop-hoc-moi?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/tim-gia-su');
    }
  };

  const quickSubjects = ['Toán Học', 'Tiếng Anh', 'Vật Lý', 'Hóa Học', 'Lập Trình', 'Luyện Thi Đại Học'];

  return (
    <header className="hero-section">
      <div className="hero-doodles">
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f3f7" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          <path d="M-100 450 Q 150 350 300 500 T 700 450 Q 850 400 900 650 L-100 650 Z" fill="#fefcbf" opacity="0.6" />
        </svg>
      </div>

      <div className="container hero-container">
        {/* Left Side: Main Pitch & Action */}
        <div className="hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={16} className="text-amber-500" />
            <span>Nền tảng kết nối Giáo dục hàng đầu</span>
          </div>

          <h1 className="hero-title">
            Kết Nối <span>Gia Sư Giỏi</span><br />
            & Khóa Học Trực Tuyến
          </h1>

          <p className="hero-description">
            Giải pháp tìm gia sư dạy kèm 1-1 tận nhà hoặc online chất lượng cao, minh bạch thông tin. Đồng thời cập nhật liên tục hàng trăm lớp học mới dành cho gia sư.
          </p>

          {/* Search Bar on Hero */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box">
            <Search size={20} className="search-icon-hero" />
            <input
              type="text"
              placeholder="Nhập môn học hoặc địa điểm (VD: Toán lớp 12, Quận 1)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">
              Tìm kiếm
            </button>
          </form>

          {/* Quick Subject Tags */}
          <div className="quick-tags-container">
            <span className="quick-tag-label">Gợi ý:</span>
            {quickSubjects.map((sub, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-tag-btn"
                onClick={() => navigate(`/lop-hoc-moi?search=${encodeURIComponent(sub)}`)}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Action Buttons for Both User Personas */}
          <div className="hero-actions-dual">
            <button className="hero-btn-primary" onClick={() => navigate('/tim-gia-su')}>
              <UserCheck size={18} />
              <span>Đăng Yêu Cầu Tìm Gia Sư</span>
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/lop-hoc-moi')}>
              <BookOpen size={18} />
              <span>Xem Lớp Mới Cần Gia Sư</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="hero-trust-indicators">
            <div className="trust-item">
              <ShieldCheck size={16} className="trust-icon" />
              <span>100% Gia sư xác minh</span>
            </div>
            <div className="trust-item">
              <GraduationCap size={16} className="trust-icon" />
              <span>Đa dạng cấp học & môn học</span>
            </div>
          </div>
        </div>

        {/* Right Side: Graphic Illustration */}
        <div className="hero-image-wrapper">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: '460px' }}>
            <circle cx="250" cy="250" r="210" fill="#a7f3d0" opacity="0.7" />
            <text x="250" y="240" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 3" fontFamily="var(--outfit)" fontSize="85" fontWeight="950" textAnchor="middle" opacity="0.6">GIA SƯ</text>
            <text x="250" y="320" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 3" fontFamily="var(--outfit)" fontSize="80" fontWeight="950" textAnchor="middle" opacity="0.6">NOVALEARN</text>

            <g id="girl-student-illustration">
              <rect x="290" y="280" width="85" height="120" rx="15" fill="#f43f5e" transform="rotate(15 290 280)" />
              <path d="M 330 260 Q 360 250 365 295" stroke="#be123c" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 235 340 L 265 340 L 260 295 L 240 295 Z" fill="#fbcfe8" />
              <path d="M 200 230 C 190 160, 310 160, 300 230 C 300 280, 200 280, 200 230 Z" fill="#b45309" />
              <circle cx="195" cy="155" r="28" fill="#b45309" />
              <circle cx="305" cy="155" r="28" fill="#b45309" />
              <path d="M 206 200 C 206 200, 294 200, 294 228 C 294 256, 280 278, 250 278 C 216 278, 206 256, 206 228 Z" fill="#ffe4e6" />
              <circle cx="228" cy="216" r="3.5" fill="#1e293b" />
              <circle cx="272" cy="216" r="3.5" fill="#1e293b" />
              <path d="M 235 242 Q 250 260 265 242" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 206 232 Q 250 148 294 232" fill="none" stroke="#1e293b" strokeWidth="6" />
              <rect x="195" y="215" width="12" height="32" rx="6" fill="#1e293b" />
              <rect x="293" y="215" width="12" height="32" rx="6" fill="#1e293b" />
              <path d="M 180 500 L 195 330 Q 250 310 305 330 L 320 500 Z" fill="#047857" />
            </g>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
