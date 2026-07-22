import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, UserCheck, UserX } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserItem {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'student' | 'tutor' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Fetch users when filters change
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
        page,
        limit
      });
      if (response.success) {
        setUsers(response.users);
        setTotal(response.total);
      } else {
        toast.error(response.error || 'Lấy danh sách hội viên thất bại.');
      }
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách hội viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user: UserItem) => {
    if (user.role === 'admin') {
      toast.warning('Không thể thay đổi trạng thái tài khoản Quản trị viên!');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const response = await adminApi.updateUserStatus(user.user_id, newStatus);
      if (response.success) {
        toast.success(`Cập nhật trạng thái tài khoản ${user.full_name} thành công!`);
        fetchUsers();
      } else {
        toast.error(response.error || 'Lỗi cập nhật trạng thái.');
      }
    } catch (error: any) {
      toast.error('Lỗi kết nối máy chủ.');
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'student' | 'tutor' | 'admin') => {
    const targetUser = users.find(u => u.user_id === userId);
    if (targetUser?.role === 'admin') {
      toast.warning('Không thể thay đổi vai trò của tài khoản Quản trị viên!');
      return;
    }
    try {
      const response = await adminApi.updateUserRole(userId, newRole);
      if (response.success) {
        toast.success('Phân quyền người dùng thành công!');
        fetchUsers();
      } else {
        toast.error(response.error || 'Lỗi phân quyền người dùng.');
      }
    } catch (error: any) {
      toast.error('Lỗi kết nối máy chủ.');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Quản lý tài khoản người dùng">
      <div className="admin-card">
        {/* Filters Bar */}
        <form onSubmit={handleSearchSubmit} className="admin-filters-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên hoặc Email..."
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
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="student">Học viên</option>
            <option value="tutor">Giảng viên</option>
            <option value="admin">Quản trị viên</option>
          </select>

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

        {/* User Table */}
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Đang tải danh sách người dùng...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td style={{ fontWeight: 600 }}>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="admin-badge primary" title="Tài khoản Quản trị viên hệ thống (Cố định)">
                            Quản trị viên
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeRole(user.user_id, e.target.value as any)}
                            style={{
                              backgroundColor: 'rgba(22, 28, 45, 0.9)',
                              border: '1px solid var(--admin-border)',
                              color: 'var(--admin-text-main)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '13px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="student">Học viên</option>
                            <option value="tutor">Giảng viên</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <span className={`admin-badge ${user.status === 'active' ? 'success' : 'danger'}`}>
                          {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          {user.role === 'admin' ? (
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--admin-text-muted)',
                                fontStyle: 'italic',
                                padding: '4px 8px'
                              }}
                              title="Tài khoản Quản trị viên không thể bị khóa"
                            >
                              Hệ thống
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`admin-btn sm ${user.status === 'active' ? 'danger' : 'success'}`}
                              title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            >
                              {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{user.status === 'active' ? 'Khóa' : 'Mở khóa'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                      Không tìm thấy người dùng phù hợp.
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
              Trang {page} / {totalPages} (Tổng số {total} hội viên)
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

export default UserManagement;
