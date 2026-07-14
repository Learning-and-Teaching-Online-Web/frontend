import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/FaqPage.css';

interface FaqPageProps {
  onBack: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FaqPage: React.FC<FaqPageProps> = ({ onBack }) => {
  // We keep track of multiple open items, with 'left-2' (the second item on the left) open by default to match the screenshot
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'left-2': true,
  });

  const toggleAccordion = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const leftColumnFaqs: FaqItem[] = [
    {
      id: 'left-1',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'left-2',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'left-3',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'left-4',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    }
  ];

  const rightColumnFaqs: FaqItem[] = [
    {
      id: 'right-1',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'right-2',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'right-3',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    },
    {
      id: 'right-4',
      question: 'What Does Royalty Free Mean?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.'
    }
  ];

  const renderFaqItem = (item: FaqItem) => {
    const isOpen = !!openItems[item.id];
    return (
      <div className="faq-accordion-item" key={item.id}>
        <button 
          className={`faq-accordion-header ${isOpen ? 'active' : ''}`}
          onClick={() => toggleAccordion(item.id)}
          aria-expanded={isOpen}
        >
          <span>{item.question}</span>
          <ChevronDown className="faq-accordion-icon" size={18} />
        </button>
        <div className={`faq-accordion-content-wrapper ${isOpen ? 'open' : ''}`}>
          <div className="faq-accordion-content">
            {item.answer}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="faq-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Homepage</a>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">FAQs</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="container faq-page-container">
        <h1 className="faq-page-title">FAQs</h1>

        <div className="faq-layout">
          {/* Left Column */}
          <div className="faq-column faq-column-left">
            {leftColumnFaqs.map(renderFaqItem)}

            {/* Illustration */}
            <div className="faq-illustration-container">
              <svg 
                viewBox="0 0 400 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="faq-svg-illustration"
              >
                {/* Background soft cloud shadow */}
                <ellipse cx="180" cy="180" rx="90" ry="50" fill="#eef2f6" />
                <path d="M 120 150 Q 180 110 240 140 Q 280 180 200 210 Q 140 210 120 150 Z" fill="#eef2f6" opacity="0.6" />

                {/* Mathematical Graph X-Y Axis */}
                <g stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
                  {/* Y Axis */}
                  <line x1="320" y1="200" x2="320" y2="300" />
                  <path d="M 317 205 L 320 200 L 323 205" fill="none" />
                  {/* X Axis */}
                  <line x1="270" y1="250" x2="370" y2="250" />
                  <path d="M 365 247 L 370 250 L 365 253" fill="none" />
                  
                  {/* Hyperbola Curve */}
                  <path d="M 285 220 Q 305 240 315 248 Q 320 250 322 255 Q 330 280 340 290" fill="none" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M 355 220 Q 335 240 325 248 Q 320 250 318 255 Q 310 280 300 290" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                </g>
                <text x="316" y="195" fill="#3b82f6" fontFamily="var(--outfit)" fontSize="14" fontWeight="600">y</text>
                <text x="375" y="254" fill="#3b82f6" fontFamily="var(--outfit)" fontSize="14" fontWeight="600">X</text>

                {/* Purple Question Mark */}
                <path 
                  d="M 265 140 C 265 130, 280 130, 280 140 C 280 148, 272 150, 272 156 M 272 163 L 272 165" 
                  stroke="#7c3aed" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  fill="none"
                />
                
                {/* Small Blue/Cyan Question Mark */}
                <path 
                  d="M 175 125 C 175 118, 185 118, 185 125 C 185 130, 180 131, 180 135 M 180 140 L 180 141" 
                  stroke="#06b6d4" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  fill="none"
                  opacity="0.8"
                />

                {/* Floating Puzzle Pieces */}
                {/* Red/Orange Puzzle piece */}
                <g transform="translate(210, 130) scale(0.65)" fill="#ef4444">
                  <path d="M10 20 H20 V10 A 5 5 0 0 1 30 10 A 5 5 0 0 1 40 10 V20 H50 V30 A 5 5 0 0 1 50 40 A 5 5 0 0 1 50 50 V60 H40 A 5 5 0 0 0 30 60 A 5 5 0 0 0 20 60 H10 V50 A 5 5 0 0 0 10 40 A 5 5 0 0 0 10 30 Z" />
                </g>
                
                {/* Blue/Purple Puzzle piece */}
                <g transform="translate(250, 165) scale(0.6) rotate(45)" fill="#6366f1">
                  <path d="M10 20 H20 V10 A 5 5 0 0 1 30 10 A 5 5 0 0 1 40 10 V20 H50 V30 A 5 5 0 0 0 60 30 A 5 5 0 0 0 60 40 V50 H40 A 5 5 0 0 0 30 60 H10 V50 Z" />
                </g>

                {/* Desk Surface */}
                <line x1="60" y1="285" x2="280" y2="285" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

                {/* Girl Illustration */}
                {/* Back Hair */}
                <path d="M 85 180 C 85 130, 135 130, 135 180 C 135 220, 85 220, 85 180 Z" fill="#2563eb" />
                
                {/* Hair Ponytail / Side Bun */}
                <circle cx="80" cy="170" r="22" fill="#2563eb" />
                <path d="M 68 182 L 58 195 L 72 195 Z" fill="#2563eb" />

                {/* Headband */}
                <path d="M 92 165 Q 110 148 132 165" stroke="#f43f5e" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Face & Neck */}
                <path d="M 124 210 Q 124 225 118 228 L 105 228 L 105 205 Z" fill="#fed7aa" /> {/* Neck */}
                <path d="M 100 160 C 100 160, 138 160, 138 185 C 138 205, 130 215, 110 215 C 96 215, 96 185, 96 185 Z" fill="#ffe4e6" /> {/* Face Base */}
                
                {/* Ear */}
                <circle cx="102" cy="188" r="7" fill="#fed7aa" />

                {/* Front Hair bangs */}
                <path d="M 98 160 Q 112 170 120 160 Q 128 172 136 168 Q 140 180 134 188 C 128 188, 126 175, 120 178 Q 110 182 100 170 Z" fill="#1d4ed8" />
                <path d="M 136 170 C 140 178, 138 190, 134 200 C 130 198, 132 185, 136 170 Z" fill="#1d4ed8" />

                {/* Face Details */}
                <path d="M 126 185 Q 129 184 132 186" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none" /> {/* Eye (closed) */}
                <path d="M 124 179 Q 129 177 133 180" stroke="#1e293b" strokeWidth="1.2" fill="none" /> {/* Eyebrow */}
                <path d="M 137 194 L 142 195 L 137 198 Z" fill="#fed7aa" /> {/* Nose */}
                <path d="M 128 204 Q 133 208 136 203" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" fill="none" /> {/* Mouth (smile) */}
                
                {/* Blush on cheek */}
                <ellipse cx="120" cy="195" rx="5" ry="3" fill="#fda4af" opacity="0.6" />

                {/* Body / Shirt */}
                <path d="M 85 285 L 85 240 Q 110 230 135 240 L 155 285 Z" fill="#8b5cf6" />
                
                {/* Hand supporting chin */}
                {/* Arm */}
                <path d="M 132 215 Q 140 235 125 255" stroke="#fed7aa" strokeWidth="7" fill="none" strokeLinecap="round" />
                {/* Hand */}
                <path d="M 130 213 C 133 213, 136 211, 136 208 C 136 206, 130 205, 127 207 Z" fill="#fed7aa" />
                <path d="M 127 252 L 115 285" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round" /> {/* Sleeve */}

                {/* White Shirt Patterns */}
                <g stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
                  {/* Pattern 1 */}
                  <path d="M 98 248 Q 102 245 106 249" fill="none" />
                  <path d="M 122 252 Q 126 248 130 253" fill="none" />
                  {/* Pattern 2 */}
                  <path d="M 92 265 C 92 265, 96 261, 100 265" fill="none" />
                  <path d="M 108 274 Q 112 270 116 275" fill="none" />
                  <path d="M 135 268 Q 139 265 143 270" fill="none" />
                </g>

                {/* Other Hand resting on table */}
                <path d="M 152 285 Q 165 272 180 273 L 180 285 Z" fill="#fed7aa" />

                {/* Laptop */}
                {/* Laptop Screen Back */}
                <path d="M 175 270 L 255 270 L 265 220 L 195 220 Z" fill="#64748b" />
                {/* Laptop Screen Face */}
                <path d="M 180 267 L 250 267 L 259 223 L 198 223 Z" fill="#3b82f6" />
                {/* Screen content reflection */}
                <path d="M 215 223 L 250 223 L 235 267 L 200 267 Z" fill="#60a5fa" opacity="0.3" />
                {/* Keyboard base */}
                <path d="M 160 282 L 270 282 L 285 270 L 175 270 Z" fill="#cbd5e1" />
                <path d="M 170 280 L 265 280 L 275 273 L 180 273 Z" fill="#94a3b8" /> {/* Trackpad and Keyboard area */}

              </svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="faq-column faq-column-right">
            {rightColumnFaqs.map(renderFaqItem)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
