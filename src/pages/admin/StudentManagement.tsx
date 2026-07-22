import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, UserCheck, UserX } from 'lucide-react';
import { toast } from 'react-toastify';

interface StudentItem {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'student' | 'tutor' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  created_at: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({
        search: search || undefined,
        role: 'student',
        status: status || undefined,
        page,
        limit
      });
      if (response.success) {
        setStudents(response.users);
        setTotal(response.total);
      } else {
        toast.error(response.error || 'Lấy danh sách học viên thất bại.');
      }
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách học viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleToggleStatus = async (student: StudentItem) => {
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    try {
      const response = await adminApi.updateUserStatus(student.user_id, newStatus);
      if (response.success) {
        toast.success(`Cập nhật trạng thái tài khoản ${student.full_name} thành công!`);
        fetchStudents();
      } else {
        toast.error(response.error || 'Lỗi cập nhật trạng thái.');
      }
    } catch (error: any) {
      toast.error('Lỗi kết nối máy chủ.');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Quản lý tài khoản Học viên">
      <div className="admin-card">
        {/* Filters Bar */}
        <form onSubmit={handleSearchSubmit} className="admin-filters-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tìm kiếm Học viên theo Tên hoặc Email..."
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
            <option value="active">Hoạt động</option>
            <option value="suspended">Đang khóa</option>
          </select>
        </form>

        {/* Students Table */}
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Đang tải danh sách học viên...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Ngày tham gia</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.user_id}>
                      <td style={{ fontWeight: 600 }}>{student.full_name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || 'Chưa cập nhật'}</td>
                      <td>
                        <span className={`admin-badge ${student.status === 'active' ? 'success' : 'danger'}`}>
                          {student.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>
                        {new Date(student.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleStatus(student)}
                            className={`admin-btn sm ${student.status === 'active' ? 'danger' : 'success'}`}
                            title={student.status === 'active' ? 'Khóa tài khoản học viên' : 'Mở khóa tài khoản'}
                          >
                            {student.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                            <span>{student.status === 'active' ? 'Khóa' : 'Mở khóa'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                      Không tìm thấy học viên nào phù hợp.
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
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="admin-page-btn"
            >
              Trang trước
            </button>
            <span className="admin-page-info">
              Trang {page} / {totalPages} (Tổng số {total} học viên)
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="admin-page-btn"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentManagement;
