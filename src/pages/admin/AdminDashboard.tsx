import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Award,
  BookCheck,
  CalendarCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

interface DashboardStats {
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  totalRevenue: number;
  completionRate: number;
  bookingStats: {
    total: number;
    completed: number;
    cancelled: number;
  };
  topTutors: Array<{
    tutor_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    rating: number;
    experience_years: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        if (response.success) {
          setStats(response.data);
        } else {
          toast.error(response.error || 'Lấy số liệu thống kê thất bại.');
        }
      } catch (error: any) {
        toast.error('Lỗi kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <AdminLayout title="Thống kê hệ thống">
      {loading ? (
        <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải số liệu thống kê...</div>
      ) : (
        <>
          {/* Stats Cards Row */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon-wrapper primary">
                <Users size={28} />
              </div>
              <div className="admin-stat-details">
                <span className="admin-stat-value">{stats?.totalStudents || 0}</span>
                <span className="admin-stat-label">Học viên</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon-wrapper success">
                <GraduationCap size={28} />
              </div>
              <div className="admin-stat-details">
                <span className="admin-stat-value">{stats?.totalTutors || 0}</span>
                <span className="admin-stat-label">Giảng viên</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon-wrapper warning">
                <BookOpen size={28} />
              </div>
              <div className="admin-stat-details">
                <span className="admin-stat-value">{stats?.totalCourses || 0}</span>
                <span className="admin-stat-label">Khóa học active</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon-wrapper danger">
                <DollarSign size={28} />
              </div>
              <div className="admin-stat-details">
                <span className="admin-stat-value" style={{ fontSize: '20px' }}>
                  {formatCurrency(stats?.totalRevenue || 0)}
                </span>
                <span className="admin-stat-label">Tổng doanh thu</span>
              </div>
            </div>
          </div>

          <div className="admin-dashboard-row">
            {/* Class Booking metrics */}
            <div className="admin-card">
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--admin-primary)" />
                <span>Hiệu suất & Lớp học</span>
              </h2>

              <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '0' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--admin-border)' }}>
                  <CalendarCheck size={24} color="#818cf8" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats?.bookingStats.total || 0}</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Tổng đặt lớp</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--admin-border)' }}>
                  <BookCheck size={24} color="#34d399" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats?.bookingStats.completed || 0}</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Hoàn thành</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--admin-border)' }}>
                  <TrendingUp size={24} color="#fbbf24" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats?.completionRate || 0}%</div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Tỷ lệ hoàn thành</div>
                </div>
              </div>
            </div>

            {/* Top Tutors */}
            <div className="admin-card">
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--admin-warning)" />
                <span>Gia sư tiêu biểu</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats?.topTutors && stats.topTutors.length > 0 ? (
                  stats.topTutors.map((t, idx) => (
                    <div key={t.tutor_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: idx < stats.topTutors.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                      <img 
                        src={t.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'} 
                        alt={t.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{t.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{t.experience_years} năm kinh nghiệm</span>
                      </div>
                      <span className="admin-badge warning">★ {t.rating}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Chưa có gia sư nào nổi bật.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
