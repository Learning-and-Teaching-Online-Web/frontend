import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { Search, MapPin, Phone, Mail, Eye } from 'lucide-react';
import ReferencePriceTable from '../components/ReferencePriceTable';

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
}

const OpenClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('--Tất cả Tỉnh/Thành--');
  const [showPriceTable, setShowPriceTable] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/class-requests/open', {
        params: {
          search,
          province,
        },
      });
      if (res.data && res.data.data) {
        setClasses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching open classes:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchClasses();
  }, [province]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClasses();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đồng/tháng';
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Banner Button: Xem bảng giá gia sư */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setShowPriceTable(!showPriceTable)}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(219, 39, 119, 0.35)',
              transition: 'transform 0.2s ease',
            }}
          >
            {showPriceTable ? 'ẨN BẢNG GIÁ GIA SƯ' : 'XEM BẢNG GIÁ GIA SƯ TẠI ĐÂY'}
          </button>
        </div>

        {/* Collapsible Reference Price Table */}
        {showPriceTable && <ReferencePriceTable />}

        {/* Main Box Container */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Header Bar */}
          <div style={{ background: '#dc2626', color: '#ffffff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              LỚP DẠY KÈM MỚI
            </h2>
            <span style={{ fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500' }}>
              Uy Tín - Tận Tâm - Nhiệt Tình
            </span>
          </div>

          {/* Filter Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ padding: '20px 24px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập mã lớp hoặc từ khóa (môn học, lớp, địa chỉ)..."
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              style={{ width: '220px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
            >
              <option value="--Tất cả Tỉnh/Thành--">--Tất cả Tỉnh/Thành--</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Đồng Nai">Đồng Nai</option>
            </select>

            <button
              type="submit"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '10px 28px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              Tìm
            </button>
          </form>

          {/* Cards Grid */}
          <div style={{ padding: '24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải danh sách lớp học...</div>
            ) : classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Hiện tại không có lớp nào phù hợp với tìm kiếm của bạn.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '20px' }}>
                {classes.map((cls) => (
                  <div
                    key={cls.request_id}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {/* Header line of card */}
                    <div style={{ background: '#fef3c7', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fde68a' }}>
                      <span style={{ fontWeight: '800', color: '#b45309', fontSize: '0.9rem' }}>
                        MS: {cls.code || '89513'}
                      </span>
                      <span style={{ fontWeight: '800', color: '#15803d', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        LỚP ĐANG CẦN GIA SƯ
                      </span>
                      <span style={{ fontWeight: '800', color: '#dc2626', fontSize: '0.9rem' }}>
                        {cls.commission_rate || 35}%
                      </span>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '14px 16px', fontSize: '0.92rem', lineHeight: '1.6', color: '#334155' }}>
                      <p style={{ margin: '0 0 6px 0' }}>
                        <strong>Lớp dạy:</strong> {cls.grade_level || 'Tất cả các lớp'}.
                      </p>
                      <p style={{ margin: '0 0 6px 0' }}>
                        <strong>Môn dạy:</strong> {cls.subject_name}.
                      </p>
                      <p style={{ margin: '0 0 6px 0', color: '#0369a1' }}>
                        <strong>Địa chỉ:</strong> {cls.address_detail} - {cls.district || ''} - {cls.province || ''} <MapPin size={15} style={{ verticalAlign: 'middle', color: '#ef4444' }} />
                      </p>
                      <p style={{ margin: '0 0 6px 0', color: '#16a34a' }}>
                        <strong>Mức lương:</strong> <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{formatCurrency(Number(cls.desired_price))}</span>
                      </p>
                      <p style={{ margin: '0 0 6px 0' }}>
                        <strong>Số buổi:</strong> {cls.sessions_per_week} buổi /tuần
                      </p>
                      <p style={{ margin: '0 0 6px 0' }}>
                        <strong>Thời gian:</strong> {cls.study_time || 'Dạy 120 phút/buổi, thời gian linh hoạt'}
                      </p>
                      <p style={{ margin: '0 0 6px 0' }}>
                        <strong>Yêu cầu:</strong> {cls.tutor_requirement || 'Sinh viên / Giáo viên'}
                      </p>
                      <p style={{ margin: '0 0 12px 0', color: '#475569' }}>
                        <strong>Liên hệ trung tâm:</strong> 0974.502.420 - 0938.708.488
                      </p>

                      {/* Footer Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '8px', opacity: 0.7 }}>
                          <Mail size={18} style={{ cursor: 'pointer' }} />
                          <Phone size={18} style={{ cursor: 'pointer' }} />
                        </div>
                        <Link
                          to={`/lop-hoc-moi/${cls.code || cls.request_id}`}
                          style={{
                            background: '#dc2626',
                            color: '#ffffff',
                            padding: '8px 20px',
                            borderRadius: '4px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
                          }}
                        >
                          <Eye size={16} /> ĐĂNG KÝ DẠY
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenClassesPage;
