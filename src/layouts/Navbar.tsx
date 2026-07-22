import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPageActive = location.pathname === '/faq' || location.pathname === '/contact';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setUserRole(localStorage.getItem('userRole'));
    };
    checkAuth();

    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

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
          <li>
            <NavLink
              to="/instructors"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Giảng viên
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
          {isAuthenticated ? (
            <>
              {userRole === 'admin' ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ marginRight: '15px', fontWeight: 600, color: '#e11d48' }}
                >
                  Kênh Admin
                </NavLink>
              ) : userRole === 'tutor' ? (
                <NavLink
                  to="/teacher/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ marginRight: '15px', fontWeight: 600, color: '#4f46e5' }}
                >
                  Kênh Gia Sư
                </NavLink>
              ) : (
                <Link to="/student/dashboard" className="auth-link" style={{ marginRight: '16px', fontWeight: 600 }}>
                  Kênh Học Viên
                </Link>
              )}
              <a href="#" onClick={handleLogout} className="auth-link">
                Đăng xuất
              </a>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) => `auth-link ${isActive ? 'active' : ''}`}
            >
              Đăng nhập / Đăng ký
            </NavLink>
          )}
          <button className="search-trigger" aria-label="Tìm kiếm">
            <Search size={18} />
          </button>
        </div >
      </div >
    </nav >
  );
};

export default Navbar;
