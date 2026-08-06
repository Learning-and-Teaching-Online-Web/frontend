import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CoreServices from '../components/home/CoreServices';
import HotOpenClasses from '../components/home/HotOpenClasses';
import TopCategories from '../components/home/TopCategories';
import FeaturedCourses from '../components/home/FeaturedCourses';
import FeaturedTutors from '../components/home/FeaturedTutors';
import GrowSkillSection from '../components/home/GrowSkillSection';
import StatsSection from '../components/home/StatsSection';
import StudentFeedbacks from '../components/home/StudentFeedbacks';
import LatestArticles from '../components/home/LatestArticles';
import CallToAction from '../components/home/CallToAction';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container-main">
      {/* 1. Hero Section - Primary Headline, Quick Search & Dual CTAs */}
      <HeroSection />

      {/* 2. Core Services - 4 Primary Platform Functions */}
      <CoreServices />

      {/* 3. Hot Open Classes - Live Class Requests from Students */}
      <HotOpenClasses />

      {/* 4. Top Subject Categories */}
      <TopCategories />

      {/* 5. Featured Online Courses */}
      <FeaturedCourses />

      {/* 6. Featured Verified Tutors Showcase */}
      <FeaturedTutors />

      {/* 7. Platform Benefits & 3-Step Guide (Students & Tutors) */}
      <GrowSkillSection />

      {/* 8. Key Statistics */}
      <StatsSection />

      {/* 9. Student & Parent Testimonials */}
      <StudentFeedbacks />

      {/* 10. Educational News & Study Tips */}
      <LatestArticles />

      {/* 11. Final Call To Action */}
      <CallToAction />
    </div>
  );
};

export default HomePage;
