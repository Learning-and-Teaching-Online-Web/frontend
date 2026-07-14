import React from 'react';

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <header className="hero-section">
      {/* Hand-drawn educational doodles background */}
      <div className="hero-doodles">
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Subtle math grid */}
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f3f7" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          
          {/* Light yellow blobs */}
          <path d="M-100 450 Q 150 350 300 500 T 700 450 Q 850 400 900 650 L-100 650 Z" fill="#fefcbf" opacity="0.6" />
          
          {/* Doodle: Notebook outline */}
          <rect x="100" y="120" width="80" height="100" rx="4" stroke="#e2e8f0" strokeWidth="2" transform="rotate(-12 100 120)" />
          <line x1="120" y1="140" x2="165" y2="130" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-12 100 120)" />
          <line x1="120" y1="160" x2="165" y2="150" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-12 100 120)" />
          <line x1="120" y1="180" x2="150" y2="173" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-12 100 120)" />
          
          {/* Doodle: Graduation Cap outline */}
          <path d="M 280 80 L 320 65 L 360 80 L 320 95 Z" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M 305 85 L 305 100 Q 320 110 335 100 L 335 85" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <line x1="360" y1="80" x2="360" y2="98" stroke="#cbd5e1" strokeWidth="1.5" />
          
          {/* Doodle: Molecules/Atom */}
          <circle cx="150" cy="420" r="6" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <circle cx="180" cy="390" r="4" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <circle cx="210" cy="430" r="8" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <line x1="156" y1="416" x2="176" y2="394" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="184" y1="394" x2="204" y2="424" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container hero-container">
        {/* Left Side: Content */}
        <div className="hero-content">
          <span className="hero-subtitle">Keep Learning</span>
          <h1 className="hero-title">
            Build Skills With<br />
            <span>Online Course</span>
          </h1>
          <p className="hero-description">
            We denounce with righteous indignation and dislike men who are
            so beguiled and demoralized that cannot trouble.
          </p>
          <button className="hero-btn" onClick={onExplore}>
            Explore Course
          </button>
        </div>

        {/* Right Side: Girls Student and "ONLINE SCHOOL" SVG */}
        <div className="hero-image-wrapper">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: '460px' }}>
            {/* Background Circle */}
            <circle cx="250" cy="250" r="210" fill="#a7f3d0" opacity="0.7" />
            
            {/* Outline Chalk text "ONLINE SCHOOL" */}
            <text x="250" y="240" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 3" fontFamily="var(--outfit)" fontSize="85" fontWeight="950" textAnchor="middle" opacity="0.6">ONLINE</text>
            <text x="250" y="320" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 3" fontFamily="var(--outfit)" fontSize="85" fontWeight="950" textAnchor="middle" opacity="0.6">SCHOOL</text>
            
            {/* Decorative Sparkles & Doodles around student */}
            <path d="M 80 120 Q 95 105 90 90 M 90 120 Q 75 105 80 90" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 420 180 Q 435 165 430 150 M 430 180 Q 415 165 420 150" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

            {/* Student Girl Illustration */}
            <g id="girl-student-illustration">
              {/* Back Backpack */}
              <rect x="290" y="280" width="85" height="120" rx="15" fill="#f43f5e" transform="rotate(15 290 280)" />
              <path d="M 330 260 Q 360 250 365 295" stroke="#be123c" strokeWidth="8" strokeLinecap="round" fill="none" />
              
              {/* Body Neck & Collar */}
              <path d="M 235 340 L 265 340 L 260 295 L 240 295 Z" fill="#fbcfe8" /> {/* Neck */}
              
              {/* Head Hair (Back) */}
              <path d="M 200 230 C 190 160, 310 160, 300 230 C 300 280, 200 280, 200 230 Z" fill="#b45309" />
              
              {/* Hair Buns (Two Space Buns) */}
              <circle cx="195" cy="155" r="28" fill="#b45309" />
              <circle cx="305" cy="155" r="28" fill="#b45309" />
              
              {/* Hair ties */}
              <rect x="204" y="172" width="12" height="6" rx="2" fill="#ef4444" transform="rotate(-15 204 172)" />
              <rect x="284" y="172" width="12" height="6" rx="2" fill="#ef4444" transform="rotate(15 284 172)" />

              {/* Head Base Face */}
              <path d="M 206 200 C 206 200, 294 200, 294 228 C 294 256, 280 278, 250 278 C 216 278, 206 256, 206 228 Z" fill="#ffe4e6" />
              
              {/* Ears */}
              <circle cx="204" cy="232" r="8" fill="#fbcfe8" />
              <circle cx="296" cy="232" r="8" fill="#fbcfe8" />

              {/* Face details */}
              {/* Eyes */}
              <circle cx="228" cy="216" r="3.5" fill="#1e293b" />
              <circle cx="272" cy="216" r="3.5" fill="#1e293b" />
              <path d="M 222 208 Q 228 205 234 208" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              <path d="M 266 208 Q 272 205 278 208" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              {/* Nose */}
              <path d="M 250 220 L 253 226 L 247 226 Z" fill="#fbcfe8" />
              {/* Smile */}
              <path d="M 235 242 Q 250 260 265 242" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 232 243 L 235 240 M 268 243 L 265 240" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
              {/* Cheeks Blush */}
              <ellipse cx="220" cy="232" rx="7" ry="4" fill="#fda4af" opacity="0.6" />
              <ellipse cx="280" cy="232" rx="7" ry="4" fill="#fda4af" opacity="0.6" />

              {/* Front Hair Bangs */}
              <path d="M 206 200 Q 230 205 250 190 Q 270 205 294 200 Q 285 178 250 178 Q 215 178 206 200 Z" fill="#78350f" />
              <path d="M 204 200 L 210 240 L 216 230 Z" fill="#78350f" />
              <path d="M 296 200 L 290 240 L 284 230 Z" fill="#78350f" />

              {/* Headphones on head */}
              <path d="M 206 232 Q 250 148 294 232" fill="none" stroke="#1e293b" strokeWidth="6" />
              <rect x="195" y="215" width="12" height="32" rx="6" fill="#1e293b" />
              <rect x="293" y="215" width="12" height="32" rx="6" fill="#1e293b" />

              {/* Torso/Shirt (Dark Green) */}
              <path d="M 180 500 L 195 330 Q 250 310 305 330 L 320 500 Z" fill="#047857" />
              {/* Arm Left raising up (cheering) */}
              <path d="M 305 338 Q 360 210 395 100" stroke="#047857" strokeWidth="32" strokeLinecap="round" fill="none" />
              <path d="M 305 338 Q 360 210 395 100" stroke="#ffe4e6" strokeWidth="20" strokeLinecap="round" fill="none" /> {/* skin showing if sleeveless, or sleeve color. Let's make it green sleeve: */}
              <path d="M 305 338 Q 335 270 355 240" stroke="#047857" strokeWidth="34" strokeLinecap="round" fill="none" />
              {/* Hand Raising */}
              <circle cx="395" cy="85" r="16" fill="#ffe4e6" />
              <path d="M 388 85 Q 380 75 390 68" stroke="#ffe4e6" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Arm Right holding books */}
              <path d="M 195 338 Q 160 380 180 440" stroke="#0369a1" strokeWidth="32" strokeLinecap="round" fill="none" />
              
              {/* Stack of books held in front */}
              <g id="books-held" transform="rotate(-10 250 410)">
                {/* Yellow Book */}
                <rect x="210" y="340" width="120" height="40" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <rect x="212" y="344" width="116" height="6" fill="#ffffff" />
                {/* Blue Book */}
                <rect x="220" y="375" width="115" height="35" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                <rect x="222" y="379" width="111" height="6" fill="#ffffff" />
              </g>

              {/* Hand Right holding books */}
              <circle cx="210" cy="425" r="13" fill="#ffe4e6" />
            </g>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
