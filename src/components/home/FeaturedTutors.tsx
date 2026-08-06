import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tutorApi from '../../services/tutorApi';
import { Star, Award, CheckCircle2, ArrowRight, UserCheck, BookOpen } from 'lucide-react';

interface Tutor {
  tutor_id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  education?: string;
  experience_years?: number;
  hourly_rate?: number;
  specialties?: string[];
  province?: string;
  is_verified?: boolean;
}

const FeaturedTutors: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await tutorApi.getAll();
        if (res && res.data) {
          // Take top 4 tutors
          setTutors(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching tutors for homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const formatHourlyRate = (rate?: number) => {
    if (!rate) return 'Thỏa thuận';
    return new Intl.NumberFormat('vi-VN').format(rate) + ' đ/giờ';
  };

  return (
    <section className="featured-tutors-section">
      <div className="container">
        <div className="section-header-flex">
          <div>
            <span className="section-subtitle">Đội Ngũ Chất Lượng</span>
            <h2 className="section-title">
              Gia Sư & Giảng Viên <span>Tiêu Biểu</span>
            </h2>
            <p className="section-description">
              100% Gia sư được xác minh bằng cấp, lý lịch rõ ràng và có nhiều kinh nghiệm giảng dạy nhiệt tình.
            </p>
          </div>
          <Link to="/instructors" className="view-all-link-btn">
            <span>Xem tất cả gia sư</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading-placeholder">
            <UserCheck className="animate-bounce" size={28} />
            <span>Đang tải danh sách gia sư tiêu biểu...</span>
          </div>
        ) : tutors.length === 0 ? (
          <div className="home-empty-state">
            <UserCheck size={40} className="text-gray-400" />
            <p>Hiện chưa có danh sách gia sư.</p>
          </div>
        ) : (
          <div className="featured-tutors-grid">
            {tutors.map((tutor) => (
              <div key={tutor.tutor_id} className="tutor-card-home">
                <div className="tutor-card-badge-row">
                  <span className="tutor-verified-tag">
                    <CheckCircle2 size={14} /> Đã xác minh
                  </span>
                  {tutor.experience_years ? (
                    <span className="tutor-exp-tag">
                      <Award size={14} /> {tutor.experience_years} năm kn
                    </span>
                  ) : null}
                </div>

                <div className="tutor-avatar-wrapper">
                  <img
                    src={tutor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={tutor.full_name}
                    className="tutor-avatar-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                <div className="tutor-home-info">
                  <h3 className="tutor-name">{tutor.full_name}</h3>
                  <p className="tutor-edu">{tutor.education || 'Giảng viên / Gia sư giỏi'}</p>

                  <div className="tutor-rating-row">
                    <div className="stars-group">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    </div>
                    <span className="rating-score">5.0 (20+ Đánh giá)</span>
                  </div>

                  {tutor.specialties && tutor.specialties.length > 0 && (
                    <div className="tutor-specs-list">
                      {tutor.specialties.slice(0, 3).map((spec, idx) => (
                        <span key={idx} className="spec-pill">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="tutor-home-footer">
                    <div className="tutor-rate">
                      <span className="rate-label">Học phí từ:</span>
                      <span className="rate-val">{formatHourlyRate(tutor.hourly_rate)}</span>
                    </div>
                    <Link to={`/instructors/${tutor.tutor_id}`} className="tutor-profile-link">
                      Xem hồ sơ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTutors;
