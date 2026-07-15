import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

const FeaturedCourses: React.FC = () => {
  return (
    <section className="featured-courses-section" style={{ padding: '40px 0 80px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Featured Courses</h2>
            <p>Explore our Popular Courses</p>
          </div>
          <Link to="/courses" className="section-header-btn">
            All Courses
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid-home">
          {mockCourses.map((course) => (
            <div key={course.course_id} className="course-card-home">
              {/* Thumbnail */}
              <Link 
                to={`/courses/${course.course_id}`}
                className="course-thumb-home" 
                style={{ display: 'block', cursor: 'pointer' }}
              >
                <img src={course.thumbnail} alt={course.title} />
                <span className="course-tag-badge">{course.subject}</span>
              </Link>

              {/* Course Info */}
              <div className="course-info-home">
                <span className="course-author-home">
                  by <span>{course.instructor}</span>
                </span>
                
                <h3 className="course-title-home">
                  <Link to={`/courses/${course.course_id}`}>
                    {course.title}
                  </Link>
                </h3>

                {/* Duration and Students count */}
                <div className="course-meta-home">
                  <div className="course-meta-item">
                    <Clock size={14} style={{ color: 'var(--primary)' }} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="course-meta-item">
                    <User size={14} style={{ color: 'var(--primary)' }} />
                    <span>{course.studentsCount} Students</span>
                  </div>
                </div>

                {/* Price Row */}
                <div className="course-price-row">
                  <div className="price-box-home">
                    {course.oldPrice && (
                      <span className="price-original-home">${course.oldPrice.toFixed(1)}</span>
                    )}
                    <span className={`price-current-home ${course.isFree ? 'free-price' : ''}`}>
                      {course.isFree ? 'Free' : `$${course.price.toFixed(1)}`}
                    </span>
                  </div>
                  <Link 
                    to={`/courses/${course.course_id}`}
                    className="view-more-link-home"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCourses;
