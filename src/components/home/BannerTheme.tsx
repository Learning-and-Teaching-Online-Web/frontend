import React from 'react';
import { useNavigate } from 'react-router-dom';

const BannerTheme: React.FC = () => {
  const navigate = useNavigate();
  const onExplore = () => navigate('/courses');
  return (
    <section className="banner-theme-section-wrapper" style={{ padding: '20px 0' }}>
      <div className="container">
        <div className="banner-theme-section">
          <div className="banner-theme-container">
            {/* Left Graphics: Floating theme screen mockups vector SVG */}
            <div className="theme-graphics-wrapper">
              <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* 1. Mobile Phone Mockup 1 (Green theme) */}
                <g transform="translate(40, 20) rotate(-10)">
                  <rect x="0" y="0" width="70" height="140" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="3" y="4" width="64" height="132" rx="5" fill="#f8fafc" />
                  
                  {/* Theme header */}
                  <rect x="3" y="4" width="64" height="20" fill="#15803d" rx="2" />
                  <circle cx="10" cy="14" r="3" fill="#ffffff" />
                  <line x1="20" y1="14" x2="50" y2="14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Theme content */}
                  <rect x="8" y="32" width="54" height="40" rx="3" fill="#e2e8f0" />
                  <rect x="8" y="78" width="54" height="6" fill="#f97316" rx="2" />
                  <line x1="8" y1="92" x2="48" y2="92" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                  <line x1="8" y1="102" x2="38" y2="102" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="50" cy="115" r="8" fill="#15803d" />
                </g>

                {/* 2. Tablet / Desktop screen Mockup 2 (Orange theme) */}
                <g transform="translate(140, 40) rotate(5)">
                  <rect x="0" y="0" width="180" height="110" rx="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="6" y="6" width="168" height="98" rx="3" fill="#f8fafc" />
                  
                  {/* Eduma logo and header */}
                  <rect x="6" y="6" width="168" height="16" fill="#ea580c" />
                  <text x="14" y="17" fill="#ffffff" fontFamily="var(--outfit)" fontSize="8" fontWeight="800">EDUMA</text>
                  
                  {/* Course Cards Grid */}
                  <rect x="12" y="30" width="44" height="30" rx="2" fill="#e2e8f0" />
                  <rect x="12" y="64" width="44" height="4" fill="#ea580c" />
                  <line x1="12" y1="74" x2="44" y2="74" stroke="#94a3b8" strokeWidth="3" />
                  
                  <rect x="68" y="30" width="44" height="30" rx="2" fill="#e2e8f0" />
                  <rect x="68" y="64" width="44" height="4" fill="#3b82f6" />
                  <line x1="68" y1="74" x2="100" y2="74" stroke="#94a3b8" strokeWidth="3" />

                  <rect x="124" y="30" width="44" height="30" rx="2" fill="#e2e8f0" />
                  <rect x="124" y="64" width="44" height="4" fill="#10b981" />
                  <line x1="124" y1="74" x2="156" y2="74" stroke="#94a3b8" strokeWidth="3" />
                </g>

                {/* 3. Small Mobile screen Mockup 3 (Blue theme) */}
                <g transform="translate(320, 90) rotate(15)">
                  <rect x="0" y="0" width="55" height="110" rx="6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="2" y="3" width="51" height="104" rx="4" fill="#ffffff" />
                  
                  <rect x="2" y="3" width="51" height="14" fill="#2563eb" />
                  <circle cx="28" cy="30" r="12" fill="#e2e8f0" />
                  <line x1="10" y1="50" x2="45" y2="50" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="15" y1="60" x2="40" y2="60" stroke="#cbd5e1" strokeWidth="2" />
                </g>
              </svg>
            </div>

            {/* Right Content */}
            <div className="theme-content">
              <span className="theme-tag">Cung cấp tuyệt vời</span>
              <h2 className="theme-title">Theme WordPress Giáo dục</h2>
              <p className="theme-desc">
                Nâng tầm Theme LMS cho WordPress. Học mọi lúc, mọi nơi.
              </p>
              <button className="theme-btn" onClick={onExplore}>
                Khám phá khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerTheme;
