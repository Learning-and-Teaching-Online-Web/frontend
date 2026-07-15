import React from 'react';
import { Award, Plus } from 'lucide-react';
import type { QuizAttempt } from '../../../data/mockStudentData';
import '../../../styles/student/QuizzesTab.css';

interface QuizzesTabProps {
  quizAttempts: QuizAttempt[];
  handleSimulateQuiz: (quizTitle: string, courseTitle: string) => void;
  formatDate: (isoString: string) => string;
}

export const QuizzesTab: React.FC<QuizzesTabProps> = ({
  quizAttempts,
  handleSimulateQuiz,
  formatDate
}) => {
  return (
    <div>
      <div className="content-header">
        <h2>Kết quả bài trắc nghiệm</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Lưu trữ kết quả đánh giá năng lực của học viên</span>
      </div>

      {/* Table of quiz attempts */}
      <div style={{ overflowX: 'auto' }}>
        <table className="quiz-list-table">
          <thead>
            <tr>
              <th>Tên bài trắc nghiệm</th>
              <th>Khóa học</th>
              <th>Điểm số</th>
              <th>Trạng thái</th>
              <th>Ngày hoàn thành</th>
            </tr>
          </thead>
          <tbody>
            {quizAttempts.map(attempt => (
              <tr key={attempt.attempt_id}>
                <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{attempt.quizTitle}</td>
                <td>{attempt.courseTitle}</td>
                <td style={{ fontWeight: 700 }}>{attempt.score} / {attempt.totalPoints}</td>
                <td>
                  <span className={attempt.isPassed ? 'badge-pass' : 'badge-fail'}>
                    {attempt.isPassed ? 'Đạt' : 'Không đạt'}
                  </span>
                </td>
                <td>{formatDate(attempt.completedAt)}</td>
              </tr>
            ))}
            {quizAttempts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa thực hiện bài kiểm tra nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action area: Simulate taking a new quiz */}
      <div style={{ marginTop: '24px', padding: '24px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px' }}>
          <Award size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
          Kiểm tra thử nghiệm năng lực (Mock Exam)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Nhấp vào bên dưới để làm thử một bài trắc nghiệm nhanh ngẫu nhiên. Hệ thống sẽ tự động chấm điểm và ghi nhận vào lịch sử học tập của bạn.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button 
            className="btn-meeting-link"
            onClick={() => handleSimulateQuiz("Đánh giá nâng cao Woo Commerce", "Building Modern E-Commerce Sites with WooCommerce")}
          >
            <Plus size={16} /> Làm trắc nghiệm WooCommerce
          </button>
          <button 
            className="btn-meeting-link"
            onClick={() => handleSimulateQuiz("Kiểm tra bố cục trang và LearnPress", "Create An LMS Website With LearnPress")}
          >
            <Plus size={16} /> Làm trắc nghiệm LearnPress
          </button>
        </div>
      </div>
    </div>
  );
};
