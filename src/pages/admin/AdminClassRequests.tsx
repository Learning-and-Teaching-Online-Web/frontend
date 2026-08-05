import React, { useEffect, useState } from 'react';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';



interface Application {
  application_id: string;
  applicant_phone: string;
  available_date?: string;
  notes?: string;
  status: string;
  created_at: string;
  tutor?: {
    tutor_id: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface ClassRequest {
  request_id: string;
  code: string;
  student_name: string;
  phone: string;
  address_detail: string;
  district?: string;
  province?: string;
  grade_level: string;
  subject_name: string;
  sessions_per_week: number;
  study_time?: string;
  tutor_requirement?: string;
  desired_price: number;
  commission_rate: number;
  status: string;
  created_at: string;
  selected_tutor?: { full_name: string; phone?: string };
  assigned_tutor?: { full_name: string; phone?: string };
  _count?: { applications: number };
}

const AdminClassRequests: React.FC = () => {
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedClass, setSelectedClass] = useState<ClassRequest | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const commissionRate = 35;


  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/class-requests', {
        params: { status: statusFilter },
      });
      if (res.data && res.data.data) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin requests:', err);
      toast.error('Lỗi khi lấy danh sách yêu cầu lớp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleApproveOpen = async (requestId: string) => {
    try {
      const res = await axiosClient.patch(`/admin/class-requests/${requestId}/approve-open`, {
        commission_rate: commissionRate,
      });
      toast.success(res.data.message || 'Đã duyệt mở lớp công khai thành công!');
      fetchRequests();
    } catch (err: any) {
      console.error('Error approving open:', err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt mở lớp.');
    }
  };

  const handleOpenApplicationsModal = async (cls: ClassRequest) => {
    setSelectedClass(cls);
    setModalOpen(true);
    try {
      const res = await axiosClient.get(`/class-requests/${cls.request_id}`);
      if (res.data && res.data.data && res.data.data.applications) {
        setApplications(res.data.data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications modal:', err);
    }
  };

  const handleAssignTutor = async (requestId: string, tutorId?: string, appId?: string) => {
    try {
      const res = await axiosClient.patch(`/admin/class-requests/${requestId}/assign-tutor`, {
        tutor_id: tutorId || null,
        application_id: appId || null,
      });
      toast.success(res.data.message || 'Đã duyệt chọn gia sư cho lớp thành công!');
      setModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      console.error('Error assigning tutor:', err);
      toast.error(err.response?.data?.message || 'Có lỗi khi giao lớp cho gia sư.');
    }
  };


  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  return (
    <AdminLayout title="Quản lý Lớp Offline & Duyệt Gia Sư">
      <div style={{ padding: '20px' }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tất cả lớp' },
            { key: 'PENDING_ADMIN', label: 'Chờ Admin duyệt mở' },
            { key: 'WAITING_TUTOR_CONFIRM', label: 'Chờ liên hệ Gia sư chọn' },
            { key: 'OPEN', label: 'Lớp chưa giao (OPEN)' },
            { key: 'ASSIGNED', label: 'Đã giao (ASSIGNED)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: statusFilter === tab.key ? '#2563eb' : '#ffffff',
                color: statusFilter === tab.key ? '#ffffff' : '#334155',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table List */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách...</div>
          ) : requests.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không có lớp học nào.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '12px 14px' }}>Mã Lớp</th>
                    <th style={{ padding: '12px 14px' }}>Học viên / SĐT</th>
                    <th style={{ padding: '12px 14px' }}>Môn & Lớp</th>
                    <th style={{ padding: '12px 14px' }}>Địa chỉ</th>
                    <th style={{ padding: '12px 14px' }}>Mức lương</th>
                    <th style={{ padding: '12px 14px' }}>Phí %</th>
                    <th style={{ padding: '12px 14px' }}>Trạng thái</th>
                    <th style={{ padding: '12px 14px' }}>Đơn ứng tuyển</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((cls) => (
                    <tr key={cls.request_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#b45309' }}>MS: {cls.code}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '600' }}>{cls.student_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cls.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div><strong>{cls.subject_name}</strong> - {cls.grade_level}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cls.sessions_per_week} buổi/tuần</div>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '200px' }}>
                        {cls.address_detail} - {cls.district}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>
                        {formatCurrency(Number(cls.desired_price))}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#dc2626' }}>
                        {cls.commission_rate}%
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            background: cls.status === 'OPEN' ? '#dcfce7' : cls.status === 'ASSIGNED' ? '#dbeafe' : '#fef3c7',
                            color: cls.status === 'OPEN' ? '#15803d' : cls.status === 'ASSIGNED' ? '#1d4ed8' : '#b45309',
                          }}
                        >
                          {cls.status === 'OPEN' ? 'LỚP CHƯA GIAO' : cls.status === 'ASSIGNED' ? 'ĐÃ GIAO' : cls.status === 'WAITING_TUTOR_CONFIRM' ? 'CHỜ GS CHỌN' : 'CHỜ DUYỆT'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: '#2563eb' }}>
                        {cls._count?.applications || 0} đơn
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {cls.status === 'PENDING_ADMIN' && (
                            <button
                              onClick={() => handleApproveOpen(cls.request_id)}
                              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                            >
                              Duyệt Mở Lớp
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenApplicationsModal(cls)}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                          >
                            Xem & Duyệt GS
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Xem Danh Sách Gia Sư Ứng Tuyển */}
        {modalOpen && selectedClass && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', width: '90%', maxWidth: '700px', padding: '24px', maxHeight: '85vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                Danh sách Gia sư Ứng tuyển Lớp MS: {selectedClass.code} ({selectedClass.subject_name} - {selectedClass.grade_level})
              </h3>

              {applications.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Chưa có gia sư nào đăng ký nhận lớp này.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applications.map((app) => (
                    <div key={app.application_id} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>
                          Gia sư: {app.tutor?.full_name || 'Đăng ký nhanh'} - SĐT: {app.applicant_phone}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                          Thời gian nhận: {app.available_date || 'N/A'}
                        </div>
                        {app.notes && <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>Ghi chú: {app.notes}</div>}
                      </div>

                      <div>
                        {app.status === 'APPROVED' ? (
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.9rem' }}>Đã Duyệt Cho Lớp</span>
                        ) : (
                          <button
                            onClick={() => handleAssignTutor(selectedClass.request_id, app.tutor?.tutor_id, app.application_id)}
                            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            Duyệt Gia Sư này
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminClassRequests;
