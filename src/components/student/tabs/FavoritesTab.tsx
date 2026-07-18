import React from 'react';
import { Heart, Trash2, Star } from 'lucide-react';
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

                <div className="tutor-footer">
                  <div className="tutor-price">
                    {tutor.hourlyRate.toLocaleString('vi-VN')}đ <span>/ giờ</span>
                  </div>
                  <button 
                    className="btn-tutor-message"
                    onClick={() => {
                      toast.info(`Mở cửa sổ chat với Giảng viên ${tutor.name}. Tính năng nhắn tin đang tải...`);
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
