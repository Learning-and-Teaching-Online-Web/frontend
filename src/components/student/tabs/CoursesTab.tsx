import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import type { EnrolledCourse } from '../../../data/mockStudentData';
import '../../../styles/student/CoursesTab.css';

interface CoursesTabProps {
  enrolledCourses: EnrolledCourse[];
  formatDate: (isoString: string) => string;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  enrolledCourses,
  formatDate
}) => {
  return (
    <div>
      <div className="content-header">
        <h2>Khóa học của tôi</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tổng số: {enrolledCourses.length} khóa học</span>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="courses-grid">
          {enrolledCourses.map(course => (
            <div key={course.course_id} className="enrolled-course-card">
              <div className="enrolled-thumb-wrapper">
                <img src={course.thumbnail} alt={course.title} className="enrolled-thumb" />
                <span className="enrolled-subject-tag">{course.subject}</span>
              </div>
              
              <div className="enrolled-info">
                <h3>{course.title}</h3>
                <p className="enrolled-instructor">Giáo viên: {course.instructor}</p>
                
                <div className="enrolled-progress-section">
                  <div className="progress-header">
                    <span>Tiến độ ({course.completedLessons}/{course.totalLessons} bài học)</span>
                    <span className="percentage">{course.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="enrolled-actions">
                  <span className="enrolled-next-session">
                    <Clock size={14} />
                    Lớp tới: {course.nextSessionTime ? formatDate(course.nextSessionTime) : 'Chưa xếp lịch'}
                  </span>
                  <button 
                    className="btn-learn"
                    onClick={() => {
                      toast.info(`Bắt đầu vào lớp: ${course.title}. Hệ thống LMS đang được tải...`);
                    }}
                  >
                    Vào học
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <BookOpen size={48} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Bạn chưa đăng ký khóa học nào. Hãy đăng ký khóa học ngay!</p>
          <Link to="/courses" className="btn-save-profile" style={{ marginTop: '20px', textDecoration: 'none' }}>
            Khám phá khóa học
          </Link>
        </div>
      )}
    </div>
  );
};
