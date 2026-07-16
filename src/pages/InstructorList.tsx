import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users } from 'lucide-react';
import { tutorApi } from '../services/tutorApi';
import '../styles/InstructorList.css';

const InstructorList: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        const res = await tutorApi.getAll();
        if (res && res.success && res.data) {
          setTutors(res.data);
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutors();
  }, []);

  return (
    <div className="instructor-page">
      {/* Hero Banner */}
      <div className="instructor-hero">
        <div className="container">
          <div className="instructor-hero-content">
            <span className="instructor-hero-badge">Đội ngũ giảng dạy</span>
            <h1 className="instructor-hero-title">Giảng Viên Của Chúng Tôi</h1>
            <p className="instructor-hero-desc">
              Học cùng những chuyên gia hàng đầu với nhiều năm kinh nghiệm thực chiến trong ngành
            </p>
          </div>
        </div>
        <div className="instructor-hero-wave" />
      </div>

      {/* Instructors Grid */}
      <div className="container instructor-container">
        {isLoading ? (
          <div className="instructor-loading">
            <div className="instructor-loading-spinner" />
            <p>Đang tải danh sách giảng viên...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="instructor-empty">
            <BookOpen size={64} strokeWidth={1} />
            <h3>Chưa có giảng viên nào</h3>
            <p>Hệ thống đang cập nhật thêm giảng viên. Vui lòng quay lại sau.</p>
            <Link to="/courses" className="instructor-back-btn">Xem Khóa Học</Link>
          </div>
        ) : (
          <div className="instructor-grid">
            {tutors.map((tutor) => {
              const name = tutor.user?.full_name || 'Giảng viên';
              const avatar = tutor.user?.avatar_url;
              const initials = name.charAt(0).toUpperCase();

              return (
                <div key={tutor.tutor_id} className="instructor-card">
                  <div className="instructor-card-top">
                    {/* Avatar */}
                    <div className="instructor-avatar-wrapper">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="instructor-avatar-img"
                        />
                      ) : (
                        <div className="instructor-avatar-placeholder">
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Social links placeholder */}
                    <div className="instructor-social">
                      <span className="social-dot" />
                      <span className="social-dot" />
                      <span className="social-dot" />
                    </div>
                  </div>

                  <div className="instructor-card-body">
                    <h3 className="instructor-name">{name}</h3>
                    {tutor.specialization && (
                      <p className="instructor-spec">{tutor.specialization}</p>
                    )}
                    {tutor.bio && (
                      <p className="instructor-bio">{tutor.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="instructor-stats">
                      <div className="instructor-stat">
                        <Star size={15} fill="#ffb800" color="#ffb800" />
                        <span>{tutor.rating ? Number(tutor.rating).toFixed(1) : '5.0'}</span>
                      </div>
                      <div className="instructor-stat">
                        <Users size={15} color="var(--primary)" />
                        <span>{tutor.total_students || 0} học viên</span>
                      </div>
                      <div className="instructor-stat">
                        <BookOpen size={15} color="var(--primary)" />
                        <span>{tutor.total_courses || 0} khóa học</span>
                      </div>
                    </div>

                    {/* Link to courses of this tutor */}
                    <Link
                      to={`/courses?tutor_id=${tutor.tutor_id}`}
                      className="instructor-view-courses"
                    >
                      Xem khóa học
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorList;
