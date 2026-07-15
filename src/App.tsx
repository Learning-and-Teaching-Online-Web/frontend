import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import AuthPage from './components/AuthPage';
import FaqPage from './components/FaqPage';
import ContactPage from './components/ContactPage';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';

// Helper component to auto-scroll to top on route change
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Handle scroll event to display scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <ScrollToTopOnNavigate />

      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Main Page Render */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:articleId" element={<BlogDetail />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Scroll To Top Button */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn" 
          onClick={scrollToTop} 
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}

export default App;
