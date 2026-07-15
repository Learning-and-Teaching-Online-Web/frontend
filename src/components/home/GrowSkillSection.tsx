import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const GrowSkillSection: React.FC = () => {
  const navigate = useNavigate();
  const onExplore = () => navigate('/courses');
  return (
    <section className="grow-skill-section" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="grow-skill-container">
          
          {/* Left Column: Stylized Vector Illustration of Student Reading on Books stack */}
          <div className="grow-skill-ill-wrapper">
            <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: '450px' }}>
              {/* Ground shadow */}
              <ellipse cx="250" cy="350" rx="200" ry="25" fill="#f1f5f9" />
              
              {/* Stack of giant books on the right */}
              <g id="giant-books" transform="translate(180, 50)">
                {/* Book 1 (Bottom, Cyan) */}
                <path d="M 50 250 L 150 250 L 150 290 L 50 290 Z" fill="#0284c7" />
                <path d="M 150 250 L 220 250 L 220 290 L 150 290 Z" fill="#e2e8f0" /> {/* Pages side */}
                <line x1="160" y1="260" x2="210" y2="260" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="160" y1="270" x2="210" y2="270" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="160" y1="280" x2="200" y2="280" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Book 2 (Middle, Orange) */}
                <path d="M 30 200 L 140 200 L 140 245 L 30 245 Z" fill="#ea580c" />
                <path d="M 140 200 L 205 200 L 205 245 L 140 245 Z" fill="#e2e8f0" /> {/* Pages side */}
                <line x1="150" y1="210" x2="195" y2="210" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="150" y1="222" x2="195" y2="222" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="150" y1="234" x2="185" y2="234" stroke="#cbd5e1" strokeWidth="2" />

                {/* Book 3 (Top, Purple) */}
                <path d="M 60 145 L 160 145 L 160 195 L 60 195 Z" fill="#7c3aed" />
                <path d="M 160 145 L 215 145 L 215 195 L 160 195 Z" fill="#e2e8f0" />
                
                {/* Student 1 (Girl sitting on top stack, reading on Laptop) */}
                <circle cx="110" cy="85" r="14" fill="#ffe4e6" />
                {/* Hair */}
                <path d="M 94 85 C 94 65, 126 65, 126 85 C 126 100, 94 100, 94 85 Z" fill="#b45309" />
                {/* Torso */}
                <path d="M 95 145 L 100 100 Q 110 95 120 100 L 125 145 Z" fill="#ec4899" />
                {/* Laptop on lap */}
                <path d="M 125 135 L 155 135 L 160 125 L 130 125 Z" fill="#64748b" />
                {/* Legs crossed */}
                <path d="M 90 145 Q 110 160 130 145" stroke="#ffe4e6" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 85 150 Q 110 165 135 150" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
              
              {/* Phone Mockup on the left */}
              <g id="phone-mockup" transform="translate(60, 80)">
                <rect x="0" y="0" width="120" height="240" rx="15" fill="#1e293b" stroke="#cbd5e1" strokeWidth="3" />
                <rect x="6" y="10" width="108" height="220" rx="8" fill="#ffffff" />
                
                {/* Shelf-like lines in phone representing browser window */}
                <line x1="20" y1="35" x2="100" y2="35" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
                <line x1="20" y1="60" x2="80" y2="60" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                <line x1="20" y1="80" x2="60" y2="80" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="120" x2="90" y2="120" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                
                {/* Student 2 (Boy sitting on books leaning on phone reading book) */}
                <g transform="translate(80, 140)">
                  <circle cx="20" cy="-25" r="12" fill="#fed7aa" />
                  {/* Hair */}
                  <path d="M 8 -25 Q 20 -40 32 -25 Z" fill="#1e293b" />
                  {/* Torso */}
                  <path d="M 5 25 L 10 -10 Q 20 -15 30 -10 L 35 25 Z" fill="#2563eb" />
                  {/* Book held */}
                  <path d="M 20 5 Q 30 -5 40 5" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" fill="none" />
                  {/* Legs */}
                  <path d="M 5 25 L -10 35 L -10 50" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M 35 25 L 45 40 L 35 50" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>
              </g>

              {/* Student 3 (Girl standing holding notepad on the left) */}
              <g id="standing-student" transform="translate(20, 110)">
                <circle cx="30" cy="50" r="14" fill="#ffe4e6" />
                {/* Hair */}
                <path d="M 14 50 C 14 25, 46 25, 46 50 C 46 65, 14 65, 14 50 Z" fill="#b45309" />
                {/* Torso */}
                <path d="M 12 180 L 15 65 Q 30 58 45 65 L 48 180 Z" fill="#0891b2" />
                {/* Book in hand */}
                <rect x="25" y="80" width="22" height="30" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" transform="rotate(10 25 80)" />
              </g>
            </svg>
          </div>

          {/* Right Column: Text & Checklist */}
          <div className="grow-skill-content">
            <h2 className="grow-title">Phát triển kỹ năng cùng LearnPress LMS</h2>
            <p className="grow-desc">
              Chúng tôi luôn nỗ lực đem lại những giá trị tốt nhất cho sự phát triển kỹ năng của bạn.
            </p>
            
            {/* Checklist */}
            <div className="grow-checklist">
              <div className="grow-check-item">
                <Check className="grow-check-icon" size={18} />
                <span>Chứng chỉ</span>
              </div>
              <div className="grow-check-item">
                <Check className="grow-check-icon" size={18} />
                <span>Chứng chỉ</span>
              </div>
              <div className="grow-check-item">
                <Check className="grow-check-icon" size={18} />
                <span>Chứng chỉ</span>
              </div>
              <div className="grow-check-item">
                <Check className="grow-check-icon" size={18} />
                <span>Chứng chỉ</span>
              </div>
            </div>

            <button className="grow-btn" onClick={onExplore}>
              Khám phá khóa học
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GrowSkillSection;
