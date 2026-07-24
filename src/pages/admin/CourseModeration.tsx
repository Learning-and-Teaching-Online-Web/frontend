import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, Eye, EyeOff, Trash2, X, BookOpen, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

interface DocumentItem {
  doc_id: string;
  title: string;
  type: string;
  url: string;
  description?: string | null;
  created_at: string;
}

interface CourseItem {
  course_id: string;
  title: string;
  subject: string;
  description?: string | null;
  price: string;
  level?: string | null;
  total_sessions?: number | null;
  session_duration_minutes?: number | null;
  thumbnail_url?: string | null;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  documents?: DocumentItem[];
  tutor: {
    verified_status?: 'pending' | 'approved' | 'rejected';
    user: {
      full_name: string;
      email: string;
      avatar_url?: string | null;
    };
  };
  created_at: string;
}

const CourseModeration: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCourses({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: 10
      });
      if (response.success) {
        setCourses(response.courses);
        setTotal(response.total);
      } else {
        toast.error(response.error || 'Lấy danh sách khóa học thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  const handleChangeStatus = async (courseId: string, newStatus: 'draft' | 'published' | 'hidden' | 'archived') => {
    try {
      const response = await adminApi.updateCourseStatus(courseId, newStatus);
      if (response.success) {
        toast.success(`Đã cập nhật trạng thái khóa học thành công!`);
        if (selectedCourse?.course_id === courseId) {
          setSelectedCourse({ ...selectedCourse, status: newStatus });
        }
        fetchCourses();
      } else {
        toast.error(response.error || 'Lỗi cập nhật trạng thái.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ.');
    }
  };

  const formatPrice = (value: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <AdminLayout title="Kiểm duyệt & Quản lý khóa học">
      <div className="admin-card">
        {/* Filters and Search */}
        <form onSubmit={handleSearchSubmit} className="admin-filters-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tìm kiếm Tên khóa học hoặc Môn học..."
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
              <Search size={18} />
            </button>
          </div>

          <select
            className="admin-select-filter"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đang hiển thị (Public)</option>
            <option value="hidden">Bị ẩn (Private)</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </form>

        {/* Courses list table */}
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải danh sách khóa học...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên khóa học</th>
                  <th>Môn học</th>
                  <th>Gia sư giảng dạy</th>
                  <th>Học phí</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.course_id}>
                      <td style={{ fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {course.title}
                      </td>
                      <td>{course.subject}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 550 }}>{course.tutor?.user?.full_name}</span>
                          {course.tutor?.verified_status !== 'approved' && (
                            <span className="admin-badge warning" style={{ fontSize: '10px', padding: '2px 6px' }} title="Tài khoản Gia sư chưa được Admin duyệt">
                              {course.tutor?.verified_status === 'pending' ? 'GS Chờ duyệt' : 'GS Chưa duyệt'}
                            </span>
                          )}
                        </div>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{course.tutor?.user?.email}</span>
                      </td>
                      <td>{formatPrice(course.price)}</td>
                      <td>
                        <span className={`admin-badge ${
                          course.status === 'published' ? 'success' : 
                          course.status === 'hidden' ? 'danger' : 
                          course.status === 'draft' ? 'secondary' : 'warning'
                        }`}>
                          {course.status === 'published' ? 'Công khai' : 
                           course.status === 'hidden' ? 'Bị ẩn' : 
                           course.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="admin-btn sm secondary"
                            title="Xem chi tiết khóa học"
                            style={{ minWidth: '72px', justifyContent: 'center' }}
                          >
                            <Eye size={14} />
                            <span>Xem</span>
                          </button>

                          {course.status === 'published' ? (
                            <button
                              onClick={() => handleChangeStatus(course.course_id, 'hidden')}
                              className="admin-btn sm danger"
                              title="Ẩn khóa học"
                              style={{ minWidth: '72px', justifyContent: 'center' }}
                            >
                              <EyeOff size={14} />
                              <span>Ẩn</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeStatus(course.course_id, 'published')}
                              className="admin-btn sm success"
                              title="Duyệt công khai khóa học"
                              style={{ minWidth: '72px', justifyContent: 'center' }}
                            >
                              <Eye size={14} />
                              <span>Hiện</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleChangeStatus(course.course_id, 'archived')}
                            className="admin-btn sm secondary"
                            title="Lưu trữ khóa học"
                            style={{ width: '30px', height: '30px', padding: 0, justifyContent: 'center' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                      Không có khóa học nào được tìm thấy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))} className="admin-page-btn">
              Trang trước
            </button>
            <span className="admin-page-info">
              Trang {page} / {totalPages} (Tổng số {total} khóa học)
            </span>
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))} className="admin-page-btn">
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* COURSE DETAIL MODAL */}
      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '700px', background: '#fff', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Chi tiết Khóa học</h3>
              <button onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Header info */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img
                src={selectedCourse.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                alt={selectedCourse.title}
                style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="admin-badge primary" style={{ fontSize: '11px' }}>{selectedCourse.subject}</span>
                  <span className={`admin-badge ${
                    selectedCourse.status === 'published' ? 'success' : 
                    selectedCourse.status === 'hidden' ? 'danger' : 
                    selectedCourse.status === 'draft' ? 'secondary' : 'warning'
                  }`}>
                    {selectedCourse.status === 'published' ? 'Công khai' : 
                     selectedCourse.status === 'hidden' ? 'Bị ẩn' : 
                     selectedCourse.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>{selectedCourse.title}</h4>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#4f46e5' }}>
                  {formatPrice(selectedCourse.price)}
                </div>
              </div>
            </div>

            {/* Description & Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Giảng viên phụ trách</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedCourse.tutor?.user?.full_name} ({selectedCourse.tutor?.user?.email})</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Tổng số buổi / Thời lượng</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedCourse.total_sessions || 1} buổi ({selectedCourse.session_duration_minutes || 60} phút/buổi)</strong>
              </div>
            </div>

            {selectedCourse.description && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Mô tả khóa học</span>
                <div style={{ fontSize: '14px', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: '1.6' }}>
                  {selectedCourse.description}
                </div>
              </div>
            )}

            {/* Curriculum Lessons */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <BookOpen size={16} style={{ color: '#4f46e5' }} /> Danh sách bài giảng & Tài liệu ({selectedCourse.documents?.length || 0})
              </span>
              
              {selectedCourse.documents && selectedCourse.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedCourse.documents.map((doc, idx) => (
                    <div key={doc.doc_id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{idx + 1}. {doc.title}</div>
                        {doc.description && <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.description}</div>}
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                        Mở file/link <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', padding: '10px 0' }}>Giảng viên chưa tải danh sách bài học nào cho khóa học này.</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              {selectedCourse.status === 'published' ? (
                <button onClick={() => handleChangeStatus(selectedCourse.course_id, 'hidden')} className="admin-btn sm danger">
                  <EyeOff size={14} /> Ẩn khóa học
                </button>
              ) : (
                <button onClick={() => handleChangeStatus(selectedCourse.course_id, 'published')} className="admin-btn sm success">
                  <Eye size={14} /> Duyệt công khai
                </button>
              )}
              <button onClick={() => setSelectedCourse(null)} className="admin-btn sm secondary">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CourseModeration;
