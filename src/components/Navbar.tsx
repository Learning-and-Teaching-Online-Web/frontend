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
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Khóa học
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Bài viết
            </NavLink>
          </li>
          <li className="nav-dropdown-wrapper">
            <a
              href="#"
              className={`nav-link ${isPageActive ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Trang <span className="dropdown-arrow">⌵</span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/faq">Hỏi đáp</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <NavLink
            to="/auth"
            className={({ isActive }) => `auth-link ${isActive ? 'active' : ''}`}
          >
            Đăng nhập / Đăng ký
          </NavLink>
          <button className="search-trigger" aria-label="Tìm kiếm">
            <Search size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
