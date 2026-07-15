import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Compass } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          {/* Column 1 */}
          <div className="footer-column">
            <div className="footer-logo">
              <BookOpen className="brand-icon" size={24} style={{ display: 'inline', marginRight: '6px' }} />
              Nova<span>Learn</span>
            </div>
            <p>
              NovaLearn là nền tảng học tập trực tuyến hàng đầu, mang đến cho bạn cơ hội tiếp cận tri thức chất lượng cao mọi lúc, mọi nơi.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon-btn" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Pinterest">
                <Compass size={16} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="social-icon-btn" aria-label="Youtube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="footer-column">
            <h3>Hỗ trợ</h3>
            <ul className="footer-links">
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li>
                <Link to="/blog">Bài viết mới nhất</Link>
              </li>
              <li>
                <Link to="/faq">Hỏi đáp</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-column">
            <h3>Chương trình</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Nghệ thuật & Thiết kế</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Kinh doanh</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>CNTT & Phần mềm</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Ngoại ngữ</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Lập trình</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-column">
            <h3>Liên hệ</h3>
            <p style={{ lineHeight: '1.6' }}>
              Địa chỉ: Khu Công Nghệ Cao, Thủ Đức, TP.HCM
            </p>
            <p style={{ marginTop: '8px' }}>
              SĐT: + 84 93 808 1475
            </p>
            <p style={{ marginTop: '4px' }}>
              Mail: supportlms@gmail.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          Copyright © 2026 NovaLearn | Powered by TEAM
        </div>
      </div>
    </footer>
  );
};

export default Footer;
