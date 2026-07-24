import React from 'react';
import { Plus } from 'lucide-react';

interface CoursesTabProps {
  courses: any[];
  formatVND: (n: number) => string;
  setIsCourseModalOpen: (open: boolean) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  formatVND,
  setIsCourseModalOpen
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Khóa học của tôi</h2>
        <button className="btn-primary-db" onClick={() => setIsCourseModalOpen(true)}>
          <Plus size={16} /> Tạo khóa học mới
        </button>
      </div>

      <div className="course-db-grid">
        {courses.map(course => (
          <div className="course-db-card" key={course.course_id}>
            <div className="course-db-thumb">
              <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'} alt={course.title} />
              <div className="course-db-badge">
                <span className={`badge badge-${course.status}`}>
                  {course.status === 'published' ? 'Đang tuyển sinh' : course.status === 'draft' ? 'Bản nháp' : 'Đã ẩn'}
                </span>
              </div>
            </div>

            <div className="course-db-body">
              <span className="course-db-subject">{course.subject}</span>
              <h3 className="course-db-title" title={course.title}>{course.title}</h3>
              <div className="course-db-price">{formatVND(Number(course.price))}</div>

              <div className="course-db-meta">
                <span>Lớp: {course.level || 'Cơ bản'}</span>
                <span>{course.studentsCount || 0} học viên</span>
                <span>{(course.schedules || []).length} lịch dạy</span>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Bạn chưa tạo khóa học nào. Hãy nhấp vào "Tạo khóa học mới" để bắt đầu soạn bài giảng.
          </div>
        )}
      </div>
    </div>
  );
};
