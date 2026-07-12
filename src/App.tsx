import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';

function App() {
  const [currentPage, setCurrentPage] = useState<'list' | 'detail'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-1');
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

  const handleNavigate = (page: 'list' | 'detail') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div className="app-container">
      {/* 1. Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 2. Main Page Render */}
      <div className="main-content">
        {currentPage === 'list' ? (
          <CourseList onSelectCourse={handleSelectCourse} />
        ) : (
          <CourseDetail courseId={selectedCourseId} onBack={() => handleNavigate('list')} />
        )}
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
