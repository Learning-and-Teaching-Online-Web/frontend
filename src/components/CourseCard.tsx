import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChevronRight, Star } from 'lucide-react';
import '../styles/CourseCard.css';

interface CourseCardProps {
  course: any;
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

  const isOffline = course.type === 'offline';
  const formatPrice = (val: number) => {
    if (!val || val === 0) return 'Free';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className={`course-card ${layout}-view`}>
      {/* Image Area */}
      <Link to={`/courses/${course.course_id}`} className="card-image-wrapper" style={{ display: 'block', position: 'relative' }}>
        <img src={course.thumbnail} alt={course.title} className="card-image" />
        <span className="card-category-badge">{course.subject}</span>
        
        {/* Online / Offline Label Badge */}
        <span 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff',
            background: isOffline ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 2
          }}
        >
          {isOffline ? '📹 Offline (Video)' : '🔴 Online (Live)'}
        </span>
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

        {/* Course Card Rating */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', fontSize: '13px' }}>
          {renderStars(course.rating)}
          <span style={{ color: 'var(--text-muted)' }}>({course.reviewCount || 0} Đánh giá)</span>
        </div>

        {/* Metadata */}
        <div className="card-meta">
          <div className="meta-item">
            <Clock size={15} className="text-primary" />
            <span>{isOffline ? `${course.lessonsCount || 1} Bài giảng video` : course.duration}</span>
          </div>
          <div className="meta-item">
            <Users size={15} />
            <span>{course.studentsCount || 0} Học viên</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="card-footer">
          <div className="price-section">
            {course.isFree ? (
              <span className="price-value free">Miễn phí</span>
            ) : (
              <span className="price-value">{formatPrice(course.price)}</span>
            )}
            {course.oldPrice && (
              <span className="old-price">{formatPrice(course.oldPrice)}</span>
            )}
          </div>

          <Link 
            to={`/courses/${course.course_id}`}
            className="view-more-btn"
          >
            Xem thêm <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
