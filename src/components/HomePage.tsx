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

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container-main">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Top Categories */}
      <TopCategories />

      {/* 3. Featured Courses */}
      <FeaturedCourses />

      {/* 4. LearnPress Addons Banner */}
      <AddonsBanner />

      {/* 5. Statistics Section */}
      <StatsSection />

      {/* 6. Grow Skill Section */}
      <GrowSkillSection />

      {/* 7. Banner Theme */}
      <BannerTheme />

      {/* 8. Student Feedbacks */}
      <StudentFeedbacks />

      {/* 9. Call To Action */}
      <CallToAction />

      {/* 10. Latest Articles */}
      <LatestArticles />
    </div>
  );
};

export default HomePage;
