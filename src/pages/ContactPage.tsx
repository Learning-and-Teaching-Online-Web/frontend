import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/ContactPage.css';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form validation
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên của bạn.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bình luận.');
      return;
    }

    // Mock success
    setSuccessMsg('Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi sớm.');
    setName('');
    setEmail('');
    setComment('');
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Homepage</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Contact</span>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="container contact-page-container">
        
        {/* Top Section: Info & Map */}
        <div className="contact-hero-section">
          
          {/* Left Column: Direct Line Info */}
          <div className="contact-intro">
            <h2>Need A Direct Line?</h2>
            <p>
              Cras massa et odio donec faucibus in. Vitae pretium massa dolor ullamcorper lectus elit quam.
            </p>
            
            <div className="contact-info-list">
              {/* Phone Box */}
              <div className="contact-info-box">
                <div className="contact-info-icon">
                  <Phone size={20} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="contact-info-text">
                  <span className="info-label">Phone</span>
                  <span className="info-value">(123) 456 7890</span>
                </div>
              </div>
              
              {/* Email Box */}
              <div className="contact-info-box">
                <div className="contact-info-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-info-text">
                  <span className="info-label">Email</span>
                  <span className="info-value">contact@thimpress.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized Vector Map Mockup */}
          <div className="contact-map-wrapper">
            <svg 
              viewBox="0 0 600 350" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="contact-map-svg"
            >
              {/* Background land */}
              <rect width="600" height="350" fill="#f4f3f0" />

              {/* Green Park Zones */}
              <path d="M 50 20 L 150 10 L 220 80 L 120 120 Z" fill="#d8ebd4" />
              <path d="M 380 40 L 480 30 L 450 150 L 330 120 Z" fill="#d8ebd4" />
              <path d="M 280 240 L 380 260 L 420 340 L 220 320 Z" fill="#d8ebd4" />

              {/* Water Bodies (River) */}
              <path 
                d="M -10 180 Q 150 120 280 180 T 610 240" 
                stroke="#c4e0e5" 
                strokeWidth="45" 
                strokeLinecap="round" 
                fill="none" 
                opacity="0.85"
              />
              <path 
                d="M -10 180 Q 150 120 280 180 T 610 240" 
                stroke="#aadaff" 
                strokeWidth="35" 
                strokeLinecap="round" 
                fill="none" 
              />
              <text x="180" y="165" fill="#5b8da3" fontFamily="var(--outfit)" fontSize="10" transform="rotate(-12 180 165)" opacity="0.7">HUDSON RIVER</text>

              {/* Street grid (White secondary roads) */}
              <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9">
                <line x1="20" y1="50" x2="580" y2="50" />
                <line x1="10" y1="130" x2="590" y2="130" />
                <line x1="30" y1="210" x2="570" y2="210" />
                <line x1="40" y1="290" x2="580" y2="290" />
                
                <line x1="80" y1="10" x2="80" y2="340" />
                <line x1="180" y1="20" x2="180" y2="330" />
                <line x1="280" y1="10" x2="280" y2="340" />
                <line x1="390" y1="20" x2="390" y2="330" />
                <line x1="490" y1="10" x2="490" y2="340" />
              </g>

              {/* Primary Highways (Yellow thicker lines) */}
              <g stroke="#ffebaf" strokeWidth="7" strokeLinecap="round">
                <path d="M -10 90 L 610 90" />
                <path d="M 330 -10 L 330 360" />
                <path d="M 50 340 L 550 10" />
              </g>
              <g stroke="#ffffff" strokeWidth="1" strokeLinecap="round">
                <path d="M -10 90 L 610 90" strokeDasharray="3 3" />
                <path d="M 330 -10 L 330 360" strokeDasharray="3 3" />
                <path d="M 50 340 L 550 10" strokeDasharray="3 3" />
              </g>

              {/* Street Name Labels */}
              <text x="90" y="45" fill="#94a3b8" fontFamily="var(--sans)" fontSize="8" fontWeight="600">BROADWAY ST</text>
              <text x="340" y="40" fill="#94a3b8" fontFamily="var(--sans)" fontSize="8" fontWeight="600" transform="rotate(90 340 40)">5TH AVENUE</text>
              <text x="430" y="80" fill="#94a3b8" fontFamily="var(--sans)" fontSize="8" fontWeight="600" transform="rotate(-33 430 80)">STATE ROUTE 9</text>

              {/* Map Locator Red Pin */}
              <g transform="translate(410, 160) scale(1.3)">
                {/* Pin Shadow */}
                <ellipse cx="12" cy="23" rx="4" ry="1.5" fill="#000000" opacity="0.25" />
                {/* Pin Shape */}
                <path 
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                  fill="#ef4444" 
                />
                <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
              </g>
            </svg>
          </div>

        </div>

        {/* Bottom Section: Form */}
        <div className="contact-form-section">
          <h2 className="form-title">Contact Us</h2>
          <p className="form-subtitle">Your email address will not be published. Required fields are marked *</p>
          
          {errorMsg && (
            <div className="contact-alert contact-alert-error">
              <AlertCircle className="contact-alert-icon" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="contact-alert contact-alert-success">
              <CheckCircle2 className="contact-alert-icon" size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* Input fields */}
            <div className="contact-form-inputs">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Name*" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Email*" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="contact-form-textarea">
              <textarea 
                className="form-input" 
                placeholder="Comment" 
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            {/* Checkbox Save Info */}
            <label className="contact-form-checkbox">
              <input 
                type="checkbox" 
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
              />
              <span>Save my name, email in this browser for the next time I comment</span>
            </label>

            {/* Submit Button */}
            <button type="submit" className="contact-submit-btn">
              Posts Comment
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
