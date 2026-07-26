import React from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

interface CoursesTabProps {
  courses: any[];
  formatVND: (n: number) => string;
  openCreateCourseModal: () => void;
  openEditCourseModal: (course: any) => void;
  openLessonsModal: (course: any) => void;
  handleDeleteCourse: (courseId: string, title: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  formatVND,
  openCreateCourseModal,
  openEditCourseModal,
  openLessonsModal,
  handleDeleteCourse
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Khóa học của tôi</h2>
        <button className="btn-primary-db" onClick={openCreateCourseModal}>
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

              <div className="course-db-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ marginRight: '8px' }}>Lớp: {course.level || 'Cơ bản'}</span>
                  <span>{course.studentsCount || 0} học viên</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-secondary-db"
                    style={{ padding: '5px 10px', fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.2)' }}
                    onClick={() => openLessonsModal(course)}
                    title="Quản lý các bài học và video giảng dạy"
                  >
                    <BookOpen size={13} /> Bài học ({course.documents?.length || 0})
                  </button>
                  <button
                    className="btn-secondary-db"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => openEditCourseModal(course)}
                  >
                    <Edit2 size={13} /> Sửa
                  </button>
                  <button
                    className="btn-action-danger"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => handleDeleteCourse(course.course_id, course.title)}
                  >
                    <Trash2 size={13} /> Xóa
                  </button>
                </div>
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
