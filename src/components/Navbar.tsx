import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import '../styles/Navbar.css';

interface NavbarProps {
  currentPage: 'home' | 'list' | 'detail' | 'auth' | 'faq' | 'contact' | 'blog_list' | 'blog_detail';
  onNavigate: (page: 'home' | 'list' | 'detail' | 'auth' | 'faq' | 'contact' | 'blog_list' | 'blog_detail') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <BookOpen className="brand-icon" size={28} strokeWidth={2.5} />
          Nova<span>Learn</span>
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
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
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'blog_list' || currentPage === 'blog_detail' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate('blog_list'); }}
            >
              Blog
            </a>
          </li>
          <li className="nav-dropdown-wrapper">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'faq' || currentPage === 'contact' ? 'active' : ''}`} 
              onClick={(e) => e.preventDefault()}
            >
              Page <span className="dropdown-arrow">⌵</span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    onNavigate('faq'); 
                  }}
                >
                  FAQs
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    onNavigate('contact'); 
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
              LearnPress Add-On
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <a 
            href="#" 
            className={`auth-link ${currentPage === 'auth' ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); onNavigate('auth'); }}
          >
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
