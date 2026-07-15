import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddonsBanner: React.FC = () => {
  const navigate = useNavigate();
  const onExplore = () => navigate('/courses');
  return (
    <section className="addons-banner-section-wrapper" style={{ padding: '20px 0' }}>
      <div className="container">
        <div className="addons-banner-section">
          <div className="addons-banner-container">
            {/* Left Content */}
            <div className="addons-content">
              <span className="addons-tag">Get More Power From</span>
              <h2 className="addons-title">LearnPress Add-Ons</h2>
              <p className="addons-desc">
                The next level of LearnPress - LMS WordPress Plugin. More Powerful, Flexible and Magical Inside.
              </p>
              <button className="addons-btn" onClick={onExplore}>
                Explorer Course
              </button>
            </div>

            {/* Right Graphics: Floating app circles vector SVG */}
            <div className="addons-graphics-wrapper">
              <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Floating animations dashed paths */}
                <path d="M 50 110 Q 150 40 250 110 T 350 110" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.5" />
                <path d="M 100 160 Q 200 200 300 120" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.5" />

                {/* 1. Purple Headphone icon circle */}
                <g transform="translate(40, 110)">
                  <circle cx="0" cy="0" r="24" fill="#a78bfa" />
                  {/* Headphone SVG shape */}
                  <path d="M-10 6 C-10 -10 10 -10 10 6" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <rect x="-12" y="2" width="6" height="8" rx="2" fill="#ffffff" />
                  <rect x="6" y="2" width="6" height="8" rx="2" fill="#ffffff" />
                </g>

                {/* 2. Blue secure shield circle */}
                <g transform="translate(110, 50)">
                  <circle cx="0" cy="0" r="28" fill="#3b82f6" />
                  {/* Shield SVG shape */}
                  <path d="M-8 -12 L 8 -12 L 8 -2 C 8 5 0 12 0 12 C 0 12 -8 5 -8 -2 Z" fill="#ffffff" />
                  <path d="M-4 -8 L 4 -8 L 4 -2 C 4 2 0 8 0 8 C 0 8 -4 2 -4 -2 Z" fill="#3b82f6" />
                </g>

                {/* 3. Cyan zoom video camera circle */}
                <g transform="translate(190, 140)">
                  <circle cx="0" cy="0" r="26" fill="#06b6d4" />
                  {/* Camera SVG shape */}
                  <rect x="-10" y="-7" width="14" height="14" rx="2" fill="#ffffff" />
                  <path d="M 6 -3 L 13 -7 L 13 7 L 6 3 Z" fill="#ffffff" />
                </g>

                {/* 4. Yellow Stripe logo circle */}
                <g transform="translate(290, 70)">
                  <circle cx="0" cy="0" r="30" fill="#eab308" />
                  {/* Stripe logo S shape */}
                  <path d="M-4 -12 C-10 -12 -10 -6 -4 -6 C 2 -6 2 0 -4 0 M-4 -12 L 4 -12 M-4 0 L 4 0" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </g>

                {/* 5. Orange megaphone circle */}
                <g transform="translate(350, 150)">
                  <circle cx="0" cy="0" r="22" fill="#f97316" />
                  {/* Megaphone shape */}
                  <path d="M-8 -4 L-4 -4 L 4 -8 L 6 -8 L 4 8 L 2 8 L-4 4 L-8 4 Z" fill="#ffffff" />
                  <path d="M-6 4 L-4 8 L 0 8 L-2 4 Z" fill="#ffffff" />
                </g>

                {/* 6. Pink WooCommerce circle */}
                <g transform="translate(250, 180)">
                  <circle cx="0" cy="0" r="25" fill="#ec4899" />
                  {/* WooCommerce W shape */}
                  <path d="M-10 -8 L-5 8 L 0 -2 L 5 8 L 10 -8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddonsBanner;
