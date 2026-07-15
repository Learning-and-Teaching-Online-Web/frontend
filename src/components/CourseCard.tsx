import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChevronRight, Star } from 'lucide-react';
import type { Course } from '../data/mockData';
import '../styles/CourseCard.css';

interface CourseCardProps {
  course: Course;
  layout: 'grid' | 'list';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, layout }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="stars-row" style={{ display: 'inline-flex', gap: '2px', marginRight: '6px' }}>
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={13} 
            fill={i < rating ? "#ffb800" : "none"} 
            color={i < rating ? "#ffb800" : "#cbd5e1"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`course-card ${layout}-view`}>
      {/* Image Area */}
      <Link to={`/courses/${course.course_id}`} className="card-image-wrapper" style={{ display: 'block' }}>
        <img src={course.thumbnail} alt={course.title} className="card-image" />
        <span className="card-category-badge">{course.subject}</span>
      </Link>

      {/* Body Area */}
      <div className="card-body">
        <div className="card-tutor">
          by <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{course.instructor}</span>
        </div>
        
        <h3 className="card-title">
          <Link to={`/courses/${course.course_id}`}>
            {course.title}
          </Link>
        </h3>

        {/* Course Card Rating for List View or Grid Detail */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', fontSize: '13px' }}>
          {renderStars(course.rating)}
          <span style={{ color: 'var(--text-muted)' }}>({course.reviewCount} Reviews)</span>
        </div>

        {/* Metadata */}
        <div className="card-meta">
          <div className="meta-item">
            <Clock size={15} className="text-primary" />
            <span>{course.duration}</span>
          </div>
          <div className="meta-item">
            <Users size={15} />
            <span>{course.studentsCount} Students</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="card-footer">
          <div className="price-section">
            {course.isFree ? (
              <span className="price-value free">Free</span>
            ) : (
              <span className="price-value">${course.price.toFixed(1)}</span>
            )}
            {course.oldPrice && (
              <span className="old-price">${course.oldPrice.toFixed(1)}</span>
            )}
          </div>

          <Link 
            to={`/courses/${course.course_id}`}
            className="view-more-btn"
          >
            View More <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
