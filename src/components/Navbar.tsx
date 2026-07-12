import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import '../styles/Navbar.css';

interface NavbarProps {
  currentPage: 'list' | 'detail';
  onNavigate: (page: 'list' | 'detail') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onNavigate('list'); }}>
          <BookOpen className="brand-icon" size={28} strokeWidth={2.5} />
          Edu<span>Press</span>
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'list' ? '' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate('list'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'list' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate('list'); }}
            >
              Courses
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              Page
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              LearnPress Add-On
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              Premium Theme
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
            Login / Register
          </a>
          <button className="search-trigger" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
