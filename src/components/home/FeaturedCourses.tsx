import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { courseApi, mapBackendCourseToFrontend } from '../../services/courseApi';

const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const res = await courseApi.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBackendCourseToFrontend);
          setCourses(mapped.slice(0, 3)); // show top 3 featured courses
        }
      } catch (err) {
        console.error('Error fetching featured courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <section className="featured-courses-section" style={{ padding: '40px 0 80px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Khóa học nổi bật</h2>
            <p>Khám phá các khóa học phổ biến của chúng tôi</p>
          </div>
          <Link to="/courses" className="section-header-btn">
            Tất cả khóa học
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid-home">
          {isLoading ? (
            <div style={{ width: '100%', gridColumn: 'span 3', padding: '40px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              Đang tải danh sách khóa học...
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
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
                    bởi <span>{course.instructor}</span>
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
                      <span>{course.studentsCount} Học viên</span>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="course-price-row">
                    <div className="price-box-home">
                      {course.oldPrice && (
                        <span className="price-original-home">${course.oldPrice.toFixed(1)}</span>
                      )}
                      <span className={`price-current-home ${course.isFree ? 'free-price' : ''}`}>
                        {course.isFree ? 'Miễn phí' : `$${course.price.toFixed(1)}`}
                      </span>
                    </div>
                    <Link 
                      to={`/courses/${course.course_id}`}
                      className="view-more-link-home"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ width: '100%', gridColumn: 'span 3', padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              Hiện tại chưa có khóa học nổi bật nào được đăng tải.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCourses;
