import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isPageActive = location.pathname === '/faq' || location.pathname === '/contact';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <BookOpen className="brand-icon" size={28} strokeWidth={2.5} />
          Nova<span>Learn</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/courses" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Blog
            </NavLink>
          </li>
          <li className="nav-dropdown-wrapper">
            <a 
              href="#" 
              className={`nav-link ${isPageActive ? 'active' : ''}`} 
              onClick={(e) => e.preventDefault()}
            >
              Page <span className="dropdown-arrow">⌵</span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
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
          <NavLink 
            to="/auth" 
            className={({ isActive }) => `auth-link ${isActive ? 'active' : ''}`}
          >
            Login / Register
          </NavLink>
          <button className="search-trigger" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
