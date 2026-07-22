import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { Eye, Check, X, FileText, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

interface TutorItem {
  tutor_id: string;
  user_id: string;
  bio: string | null;
  education: string | null;
  experience_years: number | null;
  verified_status: 'pending' | 'approved' | 'rejected';
  user: {
    full_name: string;
    email: string;
    avatar_url: string | null;
    phone: string | null;
  };
}

interface Certificate {
  cert_id: string;
  title: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
}

const TutorVerification: React.FC = () => {
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [verifiedStatus, setVerifiedStatus] = useState('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  
  // Detail selection
  const [selectedTutor, setSelectedTutor] = useState<TutorItem | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const fetchPendingCount = async () => {
    try {
      const response = await adminApi.getTutors({ verifiedStatus: 'pending', page: 1, limit: 1 });
      if (response.success) {
        setPendingCount(response.total);
      }
    } catch (e) {
      // Ignore error
    }
  };

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getTutors({
        verifiedStatus: verifiedStatus || undefined,
        page,
        limit: 10
      });
      if (response.success) {
        setTutors(response.tutors);
        setTotal(response.total);
      } else {
        toast.error(response.error || 'Lấy danh sách gia sư thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
    fetchPendingCount();
    setSelectedTutor(null);
    setCertificates([]);
  }, [page, verifiedStatus]);

  const handleSelectTutor = async (tutor: TutorItem) => {
    setSelectedTutor(tutor);
    setCertificates([]);
    setCertsLoading(true);
    setAdminNote('');
    try {
      const response = await adminApi.getTutorCertificates(tutor.tutor_id);
      if (response.success) {
        setCertificates(response.data);
      } else {
        toast.error('Không thể tải chứng chỉ của gia sư này.');
      }
    } catch (error) {
      toast.error('Lỗi khi kết nối tải chứng chỉ.');
    } finally {
      setCertsLoading(false);
    }
  };

  const handleVerifyTutor = async (tutorId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await adminApi.updateTutorVerification(tutorId, status);
      if (response.success) {
        toast.success(`Đã cập nhật trạng thái gia sư thành: ${status === 'approved' ? 'Đã duyệt' : 'Từ chối'}`);
        // Refresh
        fetchTutors();
        fetchPendingCount();
        if (selectedTutor?.tutor_id === tutorId) {
          setSelectedTutor(prev => prev ? { ...prev, verified_status: status } : null);
        }
      } else {
        toast.error(response.error || 'Lỗi cập nhật hồ sơ.');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống.');
    }
  };

  const handleVerifyCertificate = async (certId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await adminApi.updateCertificateStatus(certId, status, adminNote || undefined);
      if (response.success) {
        toast.success(`Duyệt chứng chỉ thành công!`);
        // Refresh certs list
        if (selectedTutor) {
          handleSelectTutor(selectedTutor);
        }
      } else {
        toast.error(response.error || 'Lỗi duyệt chứng chỉ.');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống.');
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <AdminLayout title="Quản lý & Duyệt hồ sơ Giảng viên">
      <div style={{ display: 'grid', gridTemplateColumns: selectedTutor ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Tutor list block */}
        <div className="admin-card">
          <div className="admin-filters-bar" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <select
              className="admin-select-filter"
              value={verifiedStatus}
              onChange={(e) => { setVerifiedStatus(e.target.value); setPage(1); }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>

            <div
              onClick={() => { setVerifiedStatus('pending'); setPage(1); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: pendingCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${pendingCount > 0 ? 'rgba(245, 158, 11, 0.35)' : 'var(--admin-border)'}`,
                color: pendingCount > 0 ? '#fbbf24' : 'var(--admin-text-muted)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
              title="Nhấp để xem danh sách hồ sơ Chờ duyệt"
            >
              <Clock size={16} />
              <span>Chờ duyệt: <strong>{pendingCount}</strong></span>
            </div>
          </div>

          {loading ? (
            <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải danh sách hồ sơ...</div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors && tutors.length > 0 ? (
                    tutors.map((t) => (
                      <tr key={t.tutor_id} className={selectedTutor?.tutor_id === t.tutor_id ? 'active-row' : ''} style={{ backgroundColor: selectedTutor?.tutor_id === t.tutor_id ? 'rgba(99, 102, 241, 0.05)' : '' }}>
                        <td style={{ fontWeight: 600 }}>{t.user?.full_name}</td>
                        <td>{t.user?.email}</td>
                        <td>
                          <span className={`admin-badge ${t.verified_status === 'approved' ? 'success' : t.verified_status === 'rejected' ? 'danger' : 'warning'}`}>
                            {t.verified_status === 'approved' ? 'Đã duyệt' : t.verified_status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                            <button onClick={() => handleSelectTutor(t)} className="admin-btn sm secondary">
                              <Eye size={14} />
                              <span>Xem</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                        Không có hồ sơ giảng viên nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))} className="admin-page-btn">
                Trang trước
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))} className="admin-page-btn">
                Trang sau
              </button>
            </div>
          )}
        </div>

        {/* Selected Tutor profile detail and certificate gallery */}
        {selectedTutor && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Hồ sơ chi tiết</h2>
              <button onClick={() => setSelectedTutor(null)} className="admin-btn sm secondary">Đóng</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img 
                src={selectedTutor.user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'} 
                alt="Avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
              />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>{selectedTutor.user?.full_name}</h3>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'block' }}>Email: {selectedTutor.user?.email}</span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'block' }}>SĐT: {selectedTutor.user?.phone || 'Chưa cung cấp'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase' }}>Học vấn / Bằng cấp</span>
                <div style={{ fontSize: '14px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {selectedTutor.education || 'Chưa điền học vấn.'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase' }}>Kinh nghiệm giảng dạy</span>
                <div style={{ fontSize: '14px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {selectedTutor.experience_years ? `${selectedTutor.experience_years} năm` : 'Chưa cập nhật.'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase' }}>Giới thiệu bản thân</span>
                <div style={{ fontSize: '14px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {selectedTutor.bio || 'Chưa điền giới thiệu.'}
                </div>
              </div>
            </div>

            {/* Verification decision for tutor profile */}
            {selectedTutor.verified_status === 'pending' && (
              <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Quyết định duyệt hồ sơ gia sư:</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleVerifyTutor(selectedTutor.tutor_id, 'approved')} className="admin-btn success sm" style={{ flexGrow: 1 }}>
                    <Check size={16} />
                    <span>Duyệt hồ sơ</span>
                  </button>
                  <button onClick={() => handleVerifyTutor(selectedTutor.tutor_id, 'rejected')} className="admin-btn danger sm" style={{ flexGrow: 1 }}>
                    <X size={16} />
                    <span>Từ chối</span>
                  </button>
                </div>
              </div>
            )}

            {/* Certificates section */}
            <h4 style={{ fontSize: '15px', fontWeight: 600, borderTop: '1px solid var(--admin-border)', paddingTop: '16px', marginBottom: '12px' }}>
              Bằng cấp / Chứng chỉ đính kèm
            </h4>

            {certsLoading ? (
              <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải danh sách bằng cấp...</div>
            ) : certificates.length > 0 ? (
              <div className="cert-gallery">
                {certificates.map((cert) => (
                  <div key={cert.cert_id} className="cert-card">
                    <div className="cert-title">{cert.title}</div>
                    
                    {/* View Cert doc */}
                    <div className="cert-img-wrapper">
                      {cert.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <img src={cert.file_url} alt="Certificate Doc" className="cert-img" />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', color: 'var(--admin-text-muted)' }}>
                          <FileText size={40} color="var(--admin-primary)" />
                          <span style={{ fontSize: '11px' }}>File chứng chỉ/PDF</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span className={`admin-badge ${cert.status === 'approved' ? 'success' : cert.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {cert.status === 'approved' ? 'Đã duyệt' : cert.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--admin-primary)', textDecoration: 'underline' }}>
                        Tải file gốc
                      </a>
                    </div>

                    {cert.admin_note && (
                      <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}>
                        Note: {cert.admin_note}
                      </div>
                    )}

                    {cert.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        <input 
                          type="text" 
                          placeholder="Lý do từ chối/ghi chú..." 
                          className="admin-search-input"
                          style={{ minWidth: '100%', padding: '6px 10px', fontSize: '12px' }}
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleVerifyCertificate(cert.cert_id, 'approved')} className="admin-btn success sm" style={{ flexGrow: 1, padding: '4px' }}>Duyệt</button>
                          <button onClick={() => handleVerifyCertificate(cert.cert_id, 'rejected')} className="admin-btn danger sm" style={{ flexGrow: 1, padding: '4px' }}>Bỏ</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>Gia sư này chưa đính kèm chứng chỉ nào.</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TutorVerification;
