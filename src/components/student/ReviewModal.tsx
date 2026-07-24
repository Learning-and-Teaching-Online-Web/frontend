import React, { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';
import { reviewApi } from '../../services/reviewApi';
import { toast } from 'react-toastify';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  tutorName: string;
  courseTitle: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  tutorName,
  courseTitle,
  onSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [professionalism, setProfessionalism] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const ratingLabels: { [key: number]: string } = {
    1: 'Rất không hài lòng 😞',
    2: 'Cần cải thiện thêm 😐',
    3: 'Tạm ổn / Bình thường 🙂',
    4: 'Hài lòng / Tốt 😊',
    5: 'Rất tuyệt vời / Xuất sắc! 🌟'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Vui lòng chọn số sao đánh giá tổng thể.');
      return;
    }

    setLoading(true);
    try {
      const response = await reviewApi.createReview({
        booking_id: bookingId,
        rating,
        professionalism,
        communication,
        punctuality,
        comment: comment.trim() || undefined
      });

      if (response.success) {
        toast.success('Cảm ơn bạn đã gửi đánh giá chất lượng giảng dạy!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.error || 'Gửi đánh giá thất bại.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Lỗi khi gửi bài đánh giá.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (
    value: number,
    onChange: (val: number) => void,
    onHover?: (val: number) => void,
    hoverValue: number = 0,
    size: number = 28
  ) => {
    return (
      <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hoverValue || value);
          return (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => onHover && onHover(star)}
              onMouseLeave={() => onHover && onHover(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                transform: active ? 'scale(1.15)' : 'scale(1)'
              }}
            >
              <Star
                size={size}
                fill={active ? '#f59e0b' : 'none'}
                color={active ? '#f59e0b' : '#64748b'}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          color: '#f8fafc',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
              Đánh giá chất lượng giảng dạy ⭐
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Giảng viên: <strong style={{ color: '#818cf8' }}>{tutorName}</strong> | Khóa học: <span style={{ color: '#cbd5e1' }}>{courseTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main 5 Star Rating */}
          <div style={{ textAlign: 'center', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
              Đánh giá tổng thể
            </span>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {renderStarRating(rating, setRating, setHoverRating, hoverRating, 32)}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fbbf24', marginTop: '10px' }}>
              {ratingLabels[hoverRating || rating]}
            </div>
          </div>

          {/* Sub-criteria Ratings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Trình độ chuyên môn & Phương pháp</span>
              {renderStarRating(professionalism, setProfessionalism, undefined, 0, 20)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Khả năng truyền đạt & Giao tiếp</span>
              {renderStarRating(communication, setCommunication, undefined, 0, 20)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Sự đúng giờ & Tác phong</span>
              {renderStarRating(punctuality, setPunctuality, undefined, 0, 20)}
            </div>
          </div>

          {/* Comment Area */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <MessageSquare size={16} color="#818cf8" />
              Lời nhận xét của bạn (Không bắt buộc)
            </label>
            <textarea
              rows={3}
              placeholder="Chia sẻ nhận xét chi tiết về bài giảng, thái độ hỗ trợ của thầy/cô..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}
            >
              <Send size={16} />
              <span>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
