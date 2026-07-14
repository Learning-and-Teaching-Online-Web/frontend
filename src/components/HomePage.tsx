import React from 'react';
import HeroSection from './home/HeroSection';
import TopCategories from './home/TopCategories';
import FeaturedCourses from './home/FeaturedCourses';
import AddonsBanner from './home/AddonsBanner';
import StatsSection from './home/StatsSection';
import GrowSkillSection from './home/GrowSkillSection';
import BannerTheme from './home/BannerTheme';
import StudentFeedbacks from './home/StudentFeedbacks';
import CallToAction from './home/CallToAction';
import LatestArticles from './home/LatestArticles';
import '../styles/HomePage.css';

interface HomePageProps {
  onNavigate: (page: 'list' | 'detail' | 'auth' | 'faq' | 'contact' | 'blog_list' | 'blog_detail') => void;
  onSelectCourse: (courseId: string) => void;
  onSelectArticle: (articleId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectCourse, onSelectArticle }) => {
  const handleExploreCourses = () => {
    onNavigate('list');
  };

  const handleSelectCategory = (_categoryName: string) => {
    // We can navigate to Courses page ('list')
    onNavigate('list');
  };

  const handleJoinAuth = () => {
    onNavigate('auth');
  };

  return (
    <div className="home-page-container-main">
      {/* 1. Hero Section */}
      <HeroSection onExplore={handleExploreCourses} />

      {/* 2. Top Categories */}
      <TopCategories onSelectCategory={handleSelectCategory} onViewAll={handleExploreCourses} />

      {/* 3. Featured Courses */}
      <FeaturedCourses onSelectCourse={onSelectCourse} onViewAll={handleExploreCourses} />

      {/* 4. LearnPress Addons Banner */}
      <AddonsBanner onExplore={handleExploreCourses} />

      {/* 5. Statistics Section */}
      <StatsSection />

      {/* 6. Grow Skill Section */}
      <GrowSkillSection onExplore={handleExploreCourses} />

      {/* 7. Banner Theme */}
      <BannerTheme onExplore={handleExploreCourses} />

      {/* 8. Student Feedbacks */}
      <StudentFeedbacks />

      {/* 9. Call To Action */}
      <CallToAction onJoinAsStudent={handleJoinAuth} onJoinAsInstructor={handleJoinAuth} />

      {/* 10. Latest Articles */}
      <LatestArticles onSelectArticle={onSelectArticle} onViewAll={() => onNavigate('blog_list')} />
    </div>
  );
};

export default HomePage;
