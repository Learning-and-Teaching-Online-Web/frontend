import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface CourseItem {
  course_id: string;
  title: string;
  subject: string;
  price: string;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  tutor: {
    verified_status?: 'pending' | 'approved' | 'rejected';
    user: {
      full_name: string;
      email: string;
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
      toast.error('Lỗi kết dung máy chủ.');
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
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          {course.status === 'published' ? (
                            <button onClick={() => handleChangeStatus(course.course_id, 'hidden')} className="admin-btn sm danger">
                              <EyeOff size={14} />
                              <span>Ẩn đi</span>
                            </button>
                          ) : (
                            <button onClick={() => handleChangeStatus(course.course_id, 'published')} className="admin-btn sm success">
                              <Eye size={14} />
                              <span>Hiện</span>
                            </button>
                          )}
                          <button onClick={() => handleChangeStatus(course.course_id, 'archived')} className="admin-btn sm secondary" title="Lưu trữ khóa học">
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
    </AdminLayout>
  );
};

export default CourseModeration;
