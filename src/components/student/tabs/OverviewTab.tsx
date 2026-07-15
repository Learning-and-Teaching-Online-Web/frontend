import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Award, 
  Clock, 
  Video 
} from 'lucide-react';
import type { 
  StudentProfile, 
  EnrolledCourse, 
  ClassSession, 
  QuizAttempt 
} from '../../../data/mockStudentData';
import { StatCard } from '../ui/StatCard';
import '../../../styles/student/OverviewTab.css';

interface OverviewTabProps {
  profile: StudentProfile;
  enrolledCourses: EnrolledCourse[];
  classSessions: ClassSession[];
  quizAttempts: QuizAttempt[];
  nextSession: ClassSession | undefined;
  avgQuizScore: string;
  mockStudyHours: number;
  formatDate: (isoString: string) => string;
  formatTime: (isoString: string) => string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  enrolledCourses,
  classSessions,
  quizAttempts,
  nextSession,
  avgQuizScore,
  mockStudyHours,
  formatDate,
  formatTime
}) => {
  return (
    <div>
      <div className="content-header">
        <h2>Xin chào, {profile.fullName}!</h2>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Thành viên từ: {formatDate(profile.joinedAt)}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <StatCard 
          icon={<BookOpen size={22} />}
          colorClass="courses"
          label="Khóa học đang học"
          value={`${enrolledCourses.length} Khóa`}
        />
        <StatCard 
          icon={<FileText size={22} />}
          colorClass="lessons"
          label="Lịch học trực tuyến"
          value={`${classSessions.filter(s => s.status === 'scheduled').length} Buổi`}
        />
        <StatCard 
          icon={<Award size={22} />}
          colorClass="quiz"
          label="Điểm trắc nghiệm TB"
          value={avgQuizScore}
        />
        <StatCard 
          icon={<Clock size={22} />}
          colorClass="hours"
          label="Thời gian học"
          value={`~${mockStudyHours} Giờ`}
        />
      </div>

      <div className="dashboard-row">
        {/* Left Column: Live class and Courses list */}
        <div>
          {nextSession ? (
            <div className="live-session-card">
              <span className="live-badge">Sắp diễn ra</span>
              <h3 className="live-title">{nextSession.courseTitle}</h3>
              <div className="live-tutor">
                <img src={nextSession.tutorAvatar} alt={nextSession.tutorName} />
                <span>Giảng viên: <strong>{nextSession.tutorName}</strong></span>
              </div>
              <div className="live-time">
                <Clock size={16} />
                <span>
                  {formatDate(nextSession.startTime)} | {formatTime(nextSession.startTime)} - {formatTime(nextSession.endTime)}
                </span>
              </div>
              <a 
                href={nextSession.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-join-live"
              >
                <Video size={18} />
                Vào phòng học (Zoom/Jitsi)
              </a>
            </div>
          ) : (
            <div className="live-session-card" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>
              <p style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                Không có buổi học trực tuyến nào sắp diễn ra.
              </p>
            </div>
          )}

          <h3 className="dashboard-section-title">
            <BookOpen size={20} style={{ color: 'var(--primary)' }} />
            Khóa học đang học gần đây
          </h3>
          
          {enrolledCourses.length > 0 ? (
            <div className="courses-grid" style={{ gridTemplateColumns: '1fr' }}>
              {enrolledCourses.slice(0, 2).map(course => (
                <div key={course.course_id} className="enrolled-course-card" style={{ display: 'flex', minHeight: '120px' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '150px', objectFit: 'cover' }} />
                  <div className="enrolled-info" style={{ flexGrow: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', height: 'auto', marginBottom: '4px' }}>{course.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tác giả: {course.instructor}</p>
                    </div>
                    <div className="enrolled-progress-section" style={{ marginBottom: 0 }}>
                      <div className="progress-header">
                        <span>Tiến độ học tập ({course.completedLessons}/{course.totalLessons} bài)</span>
                        <span className="percentage">{course.progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Chưa có khóa học nào được đăng ký.</p>
          )}
        </div>

        {/* Right Column: Quiz results history and Quick info */}
        <div>
          <h3 className="dashboard-section-title">
            <Award size={20} style={{ color: 'var(--primary)' }} />
            Trắc nghiệm gần đây
          </h3>
          
          <ul className="sidebar-menu" style={{ gap: '12px' }}>
            {quizAttempts.slice(0, 3).map(attempt => (
              <li key={attempt.attempt_id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }} title={attempt.quizTitle}>
                    {attempt.quizTitle}
                  </span>
                  <span className={attempt.isPassed ? 'badge-pass' : 'badge-fail'}>
                    {attempt.score}/10
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{attempt.courseTitle.substring(0, 25)}...</span>
                  <span>{formatDate(attempt.completedAt)}</span>
                </div>
              </li>
            ))}
            {quizAttempts.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chưa thực hiện bài test nào.</p>
            )}
          </ul>

          <div style={{ marginTop: '30px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1px dashed var(--primary)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '14px' }}>Thông tin học tập cá nhân</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.5 }}>
              <strong>Trình độ:</strong> {profile.grade_level || 'Chưa cập nhật'}<br />
              <strong>Mục tiêu:</strong> {profile.learning_goals ? profile.learning_goals.substring(0, 70) + '...' : 'Chưa cập nhật'}<br />
              <strong>Phương thức:</strong> {profile.preferred_mode === 'both' ? 'Online & Offline' : profile.preferred_mode === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
