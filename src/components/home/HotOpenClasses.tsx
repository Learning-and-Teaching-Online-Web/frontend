import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import { MapPin, ArrowRight, BookOpen, Clock, Calendar, Sparkles } from 'lucide-react';
import { formatGradeLevel } from '../../utils/formatters';

interface ClassRequest {
  request_id: string;
  code: string;
  student_name: string;
  address_detail: string;
  district?: string;
  province?: string;
  grade_level: string;
  subject_name: string;
  sessions_per_week: number;
  desired_price: number;
  commission_rate: number;
  created_at: string;
}

const HotOpenClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOpenClasses = async () => {
      try {
        const res = await axiosClient.get('/class-requests/open');
        if (res.data && res.data.data) {
          // Take first 3-6 open classes
          setClasses(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching open classes for homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenClasses();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ/tháng';
  };

  return (
    <section className="hot-open-classes-section">
      <div className="container">
        <div className="section-header-flex">
          <div>
            <span className="section-subtitle">Dành Cho Gia Sư</span>
            <h2 className="section-title">
              Lớp Học Mới <span>Đang Cần Gia Sư</span>
            </h2>
            <p className="section-description">
              Cập nhật liên tục các suất dạy mới từ học viên & phụ huynh. Nhận lớp nhanh chóng với chi phí minh bạch.
            </p>
          </div>
          <Link to="/lop-hoc-moi" className="view-all-link-btn">
            <span>Xem tất cả lớp mới</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading-placeholder">
            <Sparkles className="animate-spin" size={24} />
            <span>Đang tải danh sách lớp học mới...</span>
          </div>
        ) : classes.length === 0 ? (
          <div className="home-empty-state">
            <BookOpen size={40} className="text-gray-400" />
            <p>Hiện chưa có lớp mới nào đăng tuyển. Hãy ghé lại sau!</p>
          </div>
        ) : (
          <div className="open-classes-home-grid">
            {classes.map((cls) => (
              <div key={cls.request_id} className="home-class-card">
                <div className="home-class-card-header">
                  <span className="home-class-code">Mã lớp: #{cls.code || '89513'}</span>
                  <span className="home-class-commission">Phí: {cls.commission_rate || 35}%</span>
                </div>
                <div className="home-class-card-body">
                  <h3 className="home-class-title">
                    {cls.subject_name} - {formatGradeLevel(cls.grade_level)}
                  </h3>
                  
                  <div className="home-class-info-list">
                    <div className="info-item">
                      <MapPin size={15} className="info-icon text-orange" />
                      <span>{cls.district ? `${cls.district}, ` : ''}{cls.province || 'Toàn quốc'}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={15} className="info-icon text-blue" />
                      <span>{cls.sessions_per_week} buổi / tuần</span>
                    </div>
                    <div className="info-item">
                      <Clock size={15} className="info-icon text-purple" />
                      <span>Dạy kèm 1-1 trực tiếp</span>
                    </div>
                  </div>

                  <div className="home-class-card-footer">
                    <div className="home-class-price">
                      <span className="price-label">Mức lương:</span>
                      <span className="price-value">{formatCurrency(Number(cls.desired_price))}</span>
                    </div>
                    <Link
                      to={`/lop-hoc-moi/${cls.code || cls.request_id}`}
                      className="home-class-apply-btn"
                    >
                      Đăng ký dạy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotOpenClasses;
