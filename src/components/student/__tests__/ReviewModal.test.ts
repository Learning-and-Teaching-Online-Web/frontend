/**
 * ReviewModal.test.ts
 * Test cho ReviewModal – kiểm tra logic nút "Gửi đánh giá"
 *
 * Strategy: test trực tiếp hàm helper isReviewFormValid()
 * + test HTML render qua renderToString (SSR, không cần jsdom).
 */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { isReviewFormValid } from '../ReviewModal';

// ─── Mock reviewApi (tránh import axios thật) ──────────────────────────────────
vi.mock('../../services/reviewApi', () => ({
  reviewApi: {
    createReview: vi.fn().mockResolvedValue({ success: true }),
  },
}));

// ─── Mock react-toastify ──────────────────────────────────────────────────────
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ─── Mock lucide-react icons ──────────────────────────────────────────────────
vi.mock('lucide-react', () => ({
  Star: () => null,
  X: () => null,
  MessageSquare: () => null,
  Send: () => null,
}));

// ─── Props mặc định dùng lại ──────────────────────────────────────────────────
const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  bookingId: 'booking-001',
  tutorName: 'Nguyễn Văn A',
  courseTitle: 'Toán nâng cao',
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Unit test: hàm helper isReviewFormValid()
// ═══════════════════════════════════════════════════════════════════════════════
describe('isReviewFormValid()', () => {
  it('rating = 0 (chưa chọn) → false', () => {
    expect(isReviewFormValid(0)).toBe(false);
  });

  it('rating = 1 → true', () => {
    expect(isReviewFormValid(1)).toBe(true);
  });

  it('rating = 3 → true', () => {
    expect(isReviewFormValid(3)).toBe(true);
  });

  it('rating = 5 → true', () => {
    expect(isReviewFormValid(5)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Render tests: kiểm tra HTML output
// ═══════════════════════════════════════════════════════════════════════════════
describe('ReviewModal – render', () => {
  it('TC2 – mặc định rating=0: nút "Gửi đánh giá" bị disabled', async () => {
    const { ReviewModal } = await import('../ReviewModal');
    const html = renderToString(
      React.createElement(ReviewModal, defaultProps)
    );

    // Nút submit phải tồn tại
    expect(html).toContain('data-testid="btn-submit-review"');
    expect(html).toContain('Gửi đánh giá');

    // Khi rating=0 → isReviewFormValid(0)=false → nút có disabled
    // React SSR render disabled button: tìm đoạn HTML xung quanh btn-submit-review
    // Lấy toàn bộ chuỗi từ trước data-testid để check disabled
    const idx = html.indexOf('data-testid="btn-submit-review"');
    // Lấy 200 ký tự trước data-testid để tìm disabled
    const surroundingHtml = html.substring(Math.max(0, idx - 200), idx + 200);
    expect(surroundingHtml).toContain('disabled');
  });

  it('TC2 – rating=0: hàm isReviewFormValid xác nhận form chưa hợp lệ', () => {
    expect(isReviewFormValid(0)).toBe(false);
  });

  it('TC1 – rating=5: hàm isReviewFormValid xác nhận form hợp lệ → nút được phép submit', () => {
    // Khi người dùng chọn 5 sao → isReviewFormValid(5) = true → nút không disabled
    expect(isReviewFormValid(5)).toBe(true);
  });

  it('TC1 – render với isOpen=false → không hiển thị modal', async () => {
    const { ReviewModal } = await import('../ReviewModal');
    const html = renderToString(
      React.createElement(ReviewModal, { ...defaultProps, isOpen: false })
    );
    // Khi isOpen=false, component trả về null → html rỗng
    expect(html).toBe('');
  });

  it('TC1 – render modal hiển thị tên gia sư và khóa học', async () => {
    const { ReviewModal } = await import('../ReviewModal');
    const html = renderToString(
      React.createElement(ReviewModal, defaultProps)
    );
    expect(html).toContain('Nguyễn Văn A');
    expect(html).toContain('Toán nâng cao');
    expect(html).toContain('Đánh giá chất lượng giảng dạy');
  });

  it('TC1 – render 5 nút sao với data-testid star-btn-1 đến star-btn-5', async () => {
    const { ReviewModal } = await import('../ReviewModal');
    const html = renderToString(
      React.createElement(ReviewModal, defaultProps)
    );
    // Mỗi ngôi sao có data-testid riêng
    expect(html).toContain('data-testid="star-btn-1"');
    expect(html).toContain('data-testid="star-btn-5"');
  });

  it('TC1 – render textarea nhận xét với data-testid="comment-textarea"', async () => {
    const { ReviewModal } = await import('../ReviewModal');
    const html = renderToString(
      React.createElement(ReviewModal, defaultProps)
    );
    expect(html).toContain('data-testid="comment-textarea"');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Business logic test: trạng thái nút theo rating
// ═══════════════════════════════════════════════════════════════════════════════
describe('Logic disabled nút submit theo rating', () => {
  it('TC2 – rating=0: disabled=true (chưa chọn sao)', () => {
    const disabled = !isReviewFormValid(0);
    expect(disabled).toBe(true);
  });

  it('TC1 – rating=5, comment="Rất tốt": disabled=false (đủ điều kiện gửi)', () => {
    const rating = 5;
    // Comment không ảnh hưởng đến việc enable nút
    const disabled = !isReviewFormValid(rating);
    expect(disabled).toBe(false);
  });

  it('TC1 – rating=1 (chọn 1 sao): disabled=false', () => {
    const disabled = !isReviewFormValid(1);
    expect(disabled).toBe(false);
  });

  it('TC2 – rating âm hoặc không hợp lệ: disabled=true', () => {
    expect(isReviewFormValid(-1)).toBe(false);
    expect(isReviewFormValid(0)).toBe(false);
  });
});
