import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, UserCheck, UserX, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserItem {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'student' | 'tutor' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  created_at: string;
  student_profile?: {
    grade_level?: string | null;
    learning_goals?: string | null;
    preferred_subjects?: any;
    preferred_mode?: string | null;
    budget_max?: number | null;
  } | null;
  tutor_profile?: {
    tutor_id?: string;
    bio?: string | null;
    education?: string | null;
    experience_years?: number | null;
    hourly_rate?: number | null;
    verified_status?: string | null;
    certificates?: Array<{
      cert_id: string;
      title: string;
      file_url: string;
      status: string;
    }>;
  } | null;
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
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

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
        if (selectedUser?.user_id === user.user_id) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
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
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={user.full_name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span>{user.full_name}</span>
                        </div>
                      </td>
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
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="admin-btn sm secondary"
                            title="Xem chi tiết người dùng"
                            style={{ minWidth: '72px', justifyContent: 'center' }}
                          >
                            <Eye size={14} />
                            <span>Xem</span>
                          </button>

                          {user.role === 'admin' ? (
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'var(--admin-text-muted)',
                                fontStyle: 'italic',
                                padding: '4px 8px',
                                minWidth: '85px',
                                textAlign: 'center'
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
                              style={{ minWidth: '85px', justifyContent: 'center' }}
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

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px', background: '#fff', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Thông tin chi tiết Người dùng</h3>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <img
                src={selectedUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedUser.full_name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }}
              />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>{selectedUser.full_name}</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="admin-badge primary" style={{ textTransform: 'capitalize' }}>
                    {selectedUser.role === 'tutor' ? 'Giảng viên' : selectedUser.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                  <span className={`admin-badge ${selectedUser.status === 'active' ? 'success' : 'danger'}`}>
                    {selectedUser.status === 'active' ? 'Hoạt động' : 'Đang khóa'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Email đăng nhập</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedUser.email}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Số điện thoại</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedUser.phone || 'Chưa cập nhật'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Ngày tạo tài khoản</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{new Date(selectedUser.created_at).toLocaleDateString('vi-VN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Mã người dùng (UUID)</span>
                <code style={{ fontSize: '12px', color: '#475569' }}>{selectedUser.user_id}</code>
              </div>
            </div>

            {selectedUser.role === 'student' && selectedUser.student_profile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#4f46e5' }}>Thông tin Hồ sơ Học viên</h5>
                <div style={{ fontSize: '13px' }}>Cấp học: <strong>{selectedUser.student_profile.grade_level || 'Chưa điền'}</strong></div>
                <div style={{ fontSize: '13px' }}>Mục tiêu: <strong>{selectedUser.student_profile.learning_goals || 'Chưa điền'}</strong></div>
              </div>
            )}

            {selectedUser.role === 'tutor' && selectedUser.tutor_profile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#4f46e5' }}>Thông tin Hồ sơ Giảng viên</h5>
                <div style={{ fontSize: '13px' }}>Học vấn: <strong>{selectedUser.tutor_profile.education || 'Chưa điền'}</strong></div>
                <div style={{ fontSize: '13px' }}>Kinh nghiệm: <strong>{selectedUser.tutor_profile.experience_years ? `${selectedUser.tutor_profile.experience_years} năm` : 'Chưa điền'}</strong></div>
                <div style={{ fontSize: '13px' }}>Học phí đề xuất: <strong>{selectedUser.tutor_profile.hourly_rate ? Number(selectedUser.tutor_profile.hourly_rate).toLocaleString('vi-VN') + 'đ/giờ' : 'Chưa thiết lập'}</strong></div>
                <div style={{ fontSize: '13px' }}>Giới thiệu: <strong>{selectedUser.tutor_profile.bio || 'Chưa điền'}</strong></div>
                {selectedUser.tutor_profile.certificates && selectedUser.tutor_profile.certificates.length > 0 && (
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Chứng chỉ đính kèm ({selectedUser.tutor_profile.certificates.length}):</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedUser.tutor_profile.certificates.map(cert => (
                        <a key={cert.cert_id} href={cert.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', padding: '4px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          📄 {cert.title} ({cert.status === 'approved' ? 'Đã duyệt' : cert.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'})
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              {selectedUser.role !== 'admin' && (
                <button
                  onClick={() => handleToggleStatus(selectedUser)}
                  className={`admin-btn sm ${selectedUser.status === 'active' ? 'danger' : 'success'}`}
                >
                  {selectedUser.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                </button>
              )}
              <button onClick={() => setSelectedUser(null)} className="admin-btn sm secondary">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
