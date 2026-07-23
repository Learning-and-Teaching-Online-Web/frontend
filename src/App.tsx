import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronUp } from 'lucide-react';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import AppRoutes from './routes/AppRoutes';

// Helper component to auto-scroll to top on route change
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
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

      {/* 1. Navigation Bar (Only on public client pages) */}
      {!isAdminRoute && <Navbar />}

      {/* 2. Main Page Render */}
      <div className={isAdminRoute ? "admin-app-wrapper" : "main-content"}>
        <AppRoutes />
      </div>

      {/* 3. Footer (Only on public client pages) */}
      {!isAdminRoute && <Footer />}

      {/* 4. Scroll To Top Button */}
      {!isAdminRoute && showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* 5. Toast Notifications Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
