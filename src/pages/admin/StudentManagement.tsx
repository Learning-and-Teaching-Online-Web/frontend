import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Search, UserCheck, UserX, Eye, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface StudentItem {
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
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

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
        if (selectedStudent?.user_id === student.user_id) {
          setSelectedStudent({ ...selectedStudent, status: newStatus });
        }
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
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={student.full_name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span>{student.full_name}</span>
                        </div>
                      </td>
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
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="admin-btn sm secondary"
                            title="Xem chi tiết học viên"
                            style={{ minWidth: '72px', justifyContent: 'center' }}
                          >
                            <Eye size={14} />
                            <span>Xem</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student)}
                            className={`admin-btn sm ${student.status === 'active' ? 'danger' : 'success'}`}
                            title={student.status === 'active' ? 'Khóa tài khoản học viên' : 'Mở khóa tài khoản'}
                            style={{ minWidth: '85px', justifyContent: 'center' }}
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

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px', background: '#fff', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Hồ sơ chi tiết Học viên</h3>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <img
                src={selectedStudent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedStudent.full_name}
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }}
              />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>{selectedStudent.full_name}</h4>
                <span className={`admin-badge ${selectedStudent.status === 'active' ? 'success' : 'danger'}`}>
                  {selectedStudent.status === 'active' ? 'Tài khoản Hoạt động' : 'Tài khoản Đang khóa'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Email liên hệ</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedStudent.email}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Số điện thoại</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedStudent.phone || 'Chưa cập nhật'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Ngày gia nhập</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{new Date(selectedStudent.created_at).toLocaleDateString('vi-VN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Trình độ học vấn</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedStudent.student_profile?.grade_level || 'Chưa cập nhật'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Mục tiêu học tập</span>
                <div style={{ fontSize: '14px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {selectedStudent.student_profile?.learning_goals || 'Chưa thiết lập mục tiêu học tập.'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Môn học quan tâm</span>
                <div style={{ fontSize: '14px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {selectedStudent.student_profile?.preferred_subjects ? (
                    Array.isArray(selectedStudent.student_profile.preferred_subjects)
                      ? selectedStudent.student_profile.preferred_subjects.join(', ')
                      : String(selectedStudent.student_profile.preferred_subjects)
                  ) : 'Chưa cập nhật'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Hình thức & Ngân sách học tập</span>
                <div style={{ fontSize: '14px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  Mức chi trả tối đa: <strong>{selectedStudent.student_profile?.budget_max ? Number(selectedStudent.student_profile.budget_max).toLocaleString('vi-VN') + 'đ/giờ' : 'Chưa thiết lập'}</strong> | Hình thức: <strong>{selectedStudent.student_profile?.preferred_mode || 'Linh hoạt'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => handleToggleStatus(selectedStudent)}
                className={`admin-btn sm ${selectedStudent.status === 'active' ? 'danger' : 'success'}`}
              >
                {selectedStudent.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </button>
              <button onClick={() => setSelectedStudent(null)} className="admin-btn sm secondary">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudentManagement;
