import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { tutorApi } from '../services/tutorApi';
import { favoriteApi } from '../services/favoriteApi';
import authStorage from '../utils/authStorage';
import '../styles/InstructorList.css';

const InstructorList: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteTutorIds, setFavoriteTutorIds] = useState<string[]>([]);

  const isAuthenticated = authStorage.isAuthenticated();

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

    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await favoriteApi.getMyFavorites();
        if (res && res.success && Array.isArray(res.data)) {
          const ids = res.data.map((fav: any) => fav.tutor?.tutor_id).filter(Boolean);
          setFavoriteTutorIds(ids);
        }
      } catch (err) {
        console.error('Error fetching favorite tutors:', err);
      }
    };

    fetchTutors();
    fetchFavorites();
  }, [isAuthenticated]);

  const handleToggleFavorite = async (tutorId: string, tutorName: string) => {
    if (!isAuthenticated) {
      toast.warning('Bạn cần đăng nhập với tài khoản Học viên để thêm giảng viên yêu thích.');
      return;
    }

    const isFav = favoriteTutorIds.includes(tutorId);
    try {
      const res = await favoriteApi.toggleFavorite(tutorId);
      if (res && res.success) {
        if (isFav) {
          setFavoriteTutorIds(prev => prev.filter(id => id !== tutorId));
          toast.info(`Đã xóa ${tutorName} khỏi danh sách yêu thích.`);
        } else {
          setFavoriteTutorIds(prev => [...prev, tutorId]);
          toast.success(`Đã thêm ${tutorName} vào danh sách giảng viên yêu thích! ❤️`);
        }
      } else {
        toast.error(res?.error || 'Không thể thực hiện thao tác.');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu giảng viên yêu thích.');
    }
  };

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
              const isFav = favoriteTutorIds.includes(tutor.tutor_id);

              return (
                <div key={tutor.tutor_id} className="instructor-card">
                  <div className="instructor-card-top">
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(tutor.tutor_id, name)}
                      title={isFav ? "Bỏ yêu thích" : "Yêu thích giảng viên"}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                        zIndex: 2
                      }}
                    >
                      <Heart
                        size={18}
                        fill={isFav ? '#ef4444' : 'none'}
                        color={isFav ? '#ef4444' : '#64748b'}
                      />
                    </button>

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
