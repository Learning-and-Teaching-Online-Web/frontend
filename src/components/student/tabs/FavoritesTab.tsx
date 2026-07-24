import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Star, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import type { FavoriteTutor } from '../../../data/mockStudentData';
import '../../../styles/student/FavoritesTab.css';

interface FavoritesTabProps {
  favoriteTutors: FavoriteTutor[];
  handleRemoveFavorite: (tutorId: string) => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favoriteTutors,
  handleRemoveFavorite
}) => {
  return (
    <div>
      <div className="content-header">
        <h2>Giảng viên yêu thích</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Danh sách những giáo viên bạn đã lưu để liên hệ và book lớp học</span>
      </div>

      {favoriteTutors.length > 0 ? (
        <div className="tutors-grid">
          {favoriteTutors.map(tutor => (
            <div key={tutor.tutor_id} className="tutor-card">
              <button 
                className="btn-favorite-remove"
                onClick={() => handleRemoveFavorite(tutor.tutor_id)}
                title="Xóa khỏi danh sách yêu thích"
              >
                <Trash2 size={18} />
              </button>

              <img src={tutor.avatar} alt={tutor.name} className="tutor-card-avatar" />
              
              <div className="tutor-card-details">
                <h3>{tutor.name}</h3>
                <p className="tutor-subject">{tutor.subject}</p>
                
                <div className="tutor-rating">
                  <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                  {tutor.rating} <span>({tutor.reviewCount} đánh giá)</span>
                </div>

                <p className="tutor-bio">{tutor.bio}</p>

                <div className="tutor-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link
                    to={`/courses?tutor_id=${tutor.tutor_id}`}
                    className="btn-tutor-message"
                    style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <BookOpen size={14} /> Xem khóa học
                  </Link>
                  <button 
                    className="btn-tutor-message"
                    style={{ background: 'var(--bg-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                    onClick={() => {
                      toast.info(`Mở cửa sổ chat với Giảng viên ${tutor.name}. Tính năng nhắn tin đang được phát triển...`);
                    }}
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Heart size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Chưa lưu giảng viên yêu thích nào.</p>
        </div>
      )}
    </div>
  );
};
