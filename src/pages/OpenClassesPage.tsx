import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { Search, MapPin, Phone, Mail, Eye, BookOpen, Sparkles } from 'lucide-react';
import ReferencePriceTable from '../components/ReferencePriceTable';
import { formatGradeLevel } from '../utils/formatters';
import '../styles/OpenClassesPage.css';

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
    <div className="open-classes-wrapper">
      <div className="open-classes-container">
        
        {/* Top Banner Button: Xem bảng giá gia sư */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setShowPriceTable(!showPriceTable)}
            className="banner-toggle-btn"
          >
            <Sparkles size={18} />
            {showPriceTable ? 'ẨN BẢNG GIÁ GIA SƯ' : 'XEM BẢNG GIÁ GIA SƯ TẠI ĐÂY'}
          </button>
        </div>

        {/* Collapsible Reference Price Table */}
        {showPriceTable && <ReferencePriceTable />}

        {/* Main Box Container */}
        <div className="classes-main-box">
          
          {/* Header Bar */}
          <div className="classes-header-bar">
            <h2 className="classes-header-title">
              <BookOpen size={24} /> LỚP DẠY KÈM MỚI
            </h2>
            <span className="classes-header-subtitle">
              Uy Tín - Tận Tâm - Nhiệt Tình
            </span>
          </div>

          {/* Filter Search Bar */}
          <form onSubmit={handleSearchSubmit} className="classes-filter-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập mã lớp hoặc từ khóa (môn học, lớp, địa chỉ)..."
                className="search-input-field"
              />
              <Search size={18} className="search-icon-inside" />
            </div>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="filter-select-field"
            >
              <option value="--Tất cả Tỉnh/Thành--">--Tất cả Tỉnh/Thành--</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Đồng Nai">Đồng Nai</option>
            </select>

            <button type="submit" className="filter-submit-btn">
              <Search size={16} /> Tìm kiếm
            </button>
          </form>

          {/* Cards Grid */}
          <div className="classes-grid-padding">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: 500 }}>
                Đang tải danh sách lớp học mới...
              </div>
            ) : classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: 500 }}>
                Hiện tại không có lớp nào phù hợp với tìm kiếm của bạn.
              </div>
            ) : (
              <div className="classes-grid-container">
                {classes.map((cls) => (
                  <div key={cls.request_id} className="class-item-card">
                    
                    {/* Header line of card */}
                    <div className="class-card-header">
                      <span className="class-code-badge">
                        MS: {cls.code || '89513'}
                      </span>
                      <span className="class-status-badge">
                        LỚP ĐANG CẦN GIA SƯ
                      </span>
                      <span className="class-commission-badge">
                        Phí: {cls.commission_rate || 35}%
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="class-card-body">
                      <p className="class-info-row">
                        <strong>Lớp dạy:</strong> <span>{formatGradeLevel(cls.grade_level)}.</span>
                      </p>
                      <p className="class-info-row">
                        <strong>Môn dạy:</strong> <span style={{ fontWeight: 600, color: '#0f172a' }}>{cls.subject_name}.</span>
                      </p>
                      <p className="class-info-row">
                        <strong>Địa chỉ:</strong> 
                        <span className="class-location-text">
                          {cls.address_detail} - {cls.district || ''} - {cls.province || ''}{' '}
                          <MapPin size={15} style={{ verticalAlign: 'middle', color: '#ea580c' }} />
                        </span>
                      </p>
                      <p className="class-info-row">
                        <strong>Mức lương:</strong> 
                        <span className="class-salary-highlight">
                          {formatCurrency(Number(cls.desired_price))}
                        </span>
                      </p>
                      <p className="class-info-row">
                        <strong>Số buổi:</strong> <span>{cls.sessions_per_week} buổi /tuần</span>
                      </p>
                      <p className="class-info-row">
                        <strong>Thời gian:</strong> <span>{cls.study_time || 'Dạy 120 phút/buổi, thời gian linh hoạt'}</span>
                      </p>
                      <p className="class-info-row">
                        <strong>Yêu cầu:</strong> <span>{cls.tutor_requirement || 'Sinh viên / Giáo viên'}</span>
                      </p>
                      <p className="class-contact-text">
                        <strong>Liên hệ trung tâm:</strong> 0974.502.420 - 0938.708.488
                      </p>

                      {/* Footer Actions */}
                      <div className="class-card-footer">
                        <div className="quick-contact-icons">
                          <button className="contact-icon-btn" title="Gửi mail liên hệ">
                            <Mail size={16} />
                          </button>
                          <button className="contact-icon-btn" title="Gọi hotline">
                            <Phone size={16} />
                          </button>
                        </div>
                        <Link
                          to={`/lop-hoc-moi/${cls.code || cls.request_id}`}
                          className="apply-class-btn"
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
