import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react';

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
  const [filterType, setFilterType] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Type Filter
      if (filterType === 'online' && (course.type || 'online') !== 'online') return false;
      if (filterType === 'offline' && course.type !== 'offline') return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title?.toLowerCase().includes(q);
        const matchesSubject = course.subject?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject) return false;
      }

      return true;
    });
  }, [courses, filterType, searchQuery]);

  return (
    <div className="section-card">
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <h2>Khóa học của tôi ({courses.length})</h2>
        <button className="btn-primary-db" onClick={openCreateCourseModal}>
          <Plus size={16} /> Tạo khóa học mới
        </button>
      </div>

      {/* Filter & Search Bar for Tutor Dashboard */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        background: '#f8fafc',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Quick Type Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: filterType === 'all' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              background: filterType === 'all' ? '#4f46e5' : '#fff',
              color: filterType === 'all' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Tất cả ({courses.length})
          </button>
          <button
            onClick={() => setFilterType('online')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: filterType === 'online' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              background: filterType === 'online' ? '#4f46e5' : '#fff',
              color: filterType === 'online' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🔴 Online Live ({courses.filter(c => (c.type || 'online') === 'online').length})
          </button>
          <button
            onClick={() => setFilterType('offline')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: filterType === 'offline' ? '1px solid #d97706' : '1px solid #cbd5e1',
              background: filterType === 'offline' ? '#d97706' : '#fff',
              color: filterType === 'offline' ? '#fff' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📹 Offline Video ({courses.filter(c => c.type === 'offline').length})
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '240px' }}>
          <input
            type="text"
            placeholder="Tìm khóa học của bạn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 28px 6px 12px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none'
            }}
          />
          <Search size={15} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="course-db-grid">
        {filteredCourses.map(course => {
          const isOffline = course.type === 'offline';
          const lessonsCount = (course.lessons && course.lessons.length > 0) 
            ? course.lessons.length 
            : (course.documents?.length || 0);

          return (
            <div className="course-db-card" key={course.course_id}>
              <div className="course-db-thumb">
                <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'} alt={course.title} />
                <div className="course-db-badge" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${course.status}`}>
                    {course.status === 'published' ? 'Đang tuyển sinh' : course.status === 'draft' ? 'Bản nháp' : 'Đã ẩn'}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff',
                    background: isOffline ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  }}>
                    {isOffline ? '📹 Offline (Video)' : '🔴 Online (Live)'}
                  </span>
                </div>
              </div>

              <div className="course-db-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="course-db-subject">{course.subject}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                    {isOffline ? '📹 Tự học qua Video' : '🔴 Live trực tuyến theo lịch'}
                  </span>
                </div>
                <h3 className="course-db-title" title={course.title}>{course.title}</h3>
                <div className="course-db-price">{Number(course.price) === 0 ? 'Miễn phí' : formatVND(Number(course.price))}</div>

                <div className="course-db-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ marginRight: '8px' }}>Lớp: {course.level || 'Cơ bản'}</span>
                    <span>{course.studentsCount || 0} học viên</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-secondary-db"
                      style={{ padding: '5px 10px', fontSize: '12px', background: isOffline ? 'rgba(217, 119, 6, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: isOffline ? '#d97706' : '#4f46e5', border: isOffline ? '1px solid rgba(217, 119, 6, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)' }}
                      onClick={() => openLessonsModal(course)}
                      title="Quản lý các bài giảng video & tài liệu"
                    >
                      <BookOpen size={13} /> {isOffline ? `Bài giảng (${lessonsCount})` : `Tài liệu (${lessonsCount})`}
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
          );
        })}
        {filteredCourses.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Không tìm thấy khóa học nào phù hợp với bộ lọc.
          </div>
        )}
      </div>
    </div>
  );
};
