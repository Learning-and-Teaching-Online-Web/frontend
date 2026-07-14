import React from 'react';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Compass } from 'lucide-react';
import '../styles/Footer.css';

interface FooterProps {
  onNavigateFAQ?: () => void;
  onNavigateContact?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateFAQ, onNavigateContact }) => {
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
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
            <h3>Get Help</h3>
            <ul className="footer-links">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateContact) onNavigateContact();
                  }}
                >
                  Contact Us
                </a>
              </li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Latest Articles</a></li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateFAQ) onNavigateFAQ();
                  }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-column">
            <h3>Programs</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Art & Design</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Business</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>IT & Software</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Languages</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Programming</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p style={{ lineHeight: '1.6' }}>
              Address: Khu Cong Nghe Cao, Thu Duc, TP.HCM
            </p>
            <p style={{ marginTop: '8px' }}>
              Tel: + 84 93 808 1475
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
