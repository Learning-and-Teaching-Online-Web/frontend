import { useState, useEffect } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'list' | 'detail' | 'auth' | 'faq' | 'contact' | 'blog_list' | 'blog_detail'>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-1');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('post-1');
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

  const handleNavigate = (page: 'home' | 'list' | 'detail' | 'auth' | 'faq' | 'contact' | 'blog_list' | 'blog_detail') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentPage('blog_detail');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div className="app-container">
      {/* 1. Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 2. Main Page Render */}
      <div className="main-content">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            onSelectCourse={handleSelectCourse} 
            onSelectArticle={handleSelectArticle} 
          />
        )}
        {currentPage === 'list' && (
          <CourseList onSelectCourse={handleSelectCourse} />
        )}
        {currentPage === 'detail' && (
          <CourseDetail courseId={selectedCourseId} onBack={() => handleNavigate('list')} />
        )}
        {currentPage === 'auth' && (
          <AuthPage onBack={() => handleNavigate('home')} />
        )}
        {currentPage === 'faq' && (
          <FaqPage onBack={() => handleNavigate('home')} />
        )}
        {currentPage === 'contact' && (
          <ContactPage onBack={() => handleNavigate('home')} />
        )}
        {currentPage === 'blog_list' && (
          <BlogList onSelectArticle={handleSelectArticle} onBack={() => handleNavigate('home')} />
        )}
        {currentPage === 'blog_detail' && (
          <BlogDetail articleId={selectedArticleId} onSelectArticle={handleSelectArticle} onBack={() => handleNavigate('blog_list')} />
        )}
      </div>

      {/* 3. Footer */}
      <Footer 
        onNavigateFAQ={() => handleNavigate('faq')} 
        onNavigateContact={() => handleNavigate('contact')} 
      />

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
