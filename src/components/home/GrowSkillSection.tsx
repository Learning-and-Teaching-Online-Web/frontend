import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, BookOpen, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

const GrowSkillSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'student' | 'tutor'>('student');

  const studentSteps = [
    {
      num: '01',
      title: 'Đăng Yêu Cầu Tìm Gia Sư',
      desc: 'Điền thông tin môn học, địa điểm, lịch học và mức thù lao mong muốn.',
    },
    {
      num: '02',
      title: 'Nhận Đề Xuất Gia Sư Phù Hợp',
      desc: 'Hệ thống sàng lọc và gửi hồ sơ gia sư uy tín đã xác minh cho bạn.',
    },
    {
      num: '03',
      title: 'Học Thử & Bắt Đầu Học Tập',
      desc: 'Được trải nghiệm chất lượng giảng dạy, tối ưu hóa kết quả học tập nhanh chóng.',
    },
  ];

  const tutorSteps = [
    {
      num: '01',
      title: 'Tạo Hồ Sơ Gia Sư Uy Tín',
      desc: 'Cập nhật thông tin học vấn, bằng cấp và các môn học thế mạnh của bạn.',
    },
    {
      num: '02',
      title: 'Duyệt & Đăng Ký Nhận Lớp',
      desc: 'Khám phá danh sách lớp mới cập nhật liên tục và chọn lớp phù hợp thời gian.',
    },
    {
      num: '03',
      title: 'Nhận Lớp & Gia Tăng Thu Nhập',
      desc: 'Bắt đầu giảng dạy trực tiếp/online với mức phí minh bạch và đảm bảo quyền lợi.',
    },
  ];

  return (
    <section className="grow-skill-section">
      <div className="container">
        <div className="grow-skill-container">
          {/* Left Column: Platform Benefits */}
          <div className="grow-skill-ill-wrapper">
            <div className="why-choose-card">
              <span className="why-badge">Ưu Điểm Vượt Trội</span>
              <h3 className="why-card-title">Vì Sao Hơn 25.000+ Học Viên Chọn NovaLearn?</h3>
              
              <div className="why-benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon-box bg-indigo-50 text-indigo-600">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="benefit-title">100% Gia sư được xác minh</h4>
                    <p className="benefit-desc">Bằng cấp, chứng chỉ và lý lịch được kiểm duyệt nghiêm ngặt.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon-box bg-amber-50 text-amber-600">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 className="benefit-title">Linh hoạt thời gian & Địa điểm</h4>
                    <p className="benefit-desc">Dạy kèm tại nhà hoặc học trực tuyến 1-1 theo thời khóa biểu của bạn.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon-box bg-emerald-50 text-emerald-600">
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 className="benefit-title">Minh bạch chi phí & Đảm bảo</h4>
                    <p className="benefit-desc">Mức học phí niêm yết rõ ràng, hỗ trợ đổi gia sư nếu chưa phù hợp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: How it works Switchable */}
          <div className="grow-skill-content">
            <span className="section-subtitle">Quy Trình Hoạt Động</span>
            <h2 className="grow-title">
              Kết Nối Đơn Giản Trong <span>3 Bước</span>
            </h2>
            <p className="grow-desc">
              Dù bạn là học viên muốn tìm gia sư giỏi hay gia sư tìm kiếm lớp dạy mới, NovaLearn luôn mang lại quy trình chuyên nghiệp nhất.
            </p>

            {/* Tab Toggle */}
            <div className="how-it-works-tabs">
              <button
                className={`tab-switch-btn ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                <UserCheck size={16} /> Dành Cho Học Viên
              </button>
              <button
                className={`tab-switch-btn ${activeTab === 'tutor' ? 'active' : ''}`}
                onClick={() => setActiveTab('tutor')}
              >
                <BookOpen size={16} /> Dành Cho Gia Sư
              </button>
            </div>

            {/* Steps List */}
            <div className="steps-timeline">
              {(activeTab === 'student' ? studentSteps : tutorSteps).map((step, idx) => (
                <div key={idx} className="timeline-step-item">
                  <div className="step-number">{step.num}</div>
                  <div className="step-info">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grow-actions">
              {activeTab === 'student' ? (
                <button className="grow-btn-primary" onClick={() => navigate('/tim-gia-su')}>
                  <span>Tạo yêu cầu tìm gia sư ngay</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button className="grow-btn-primary" onClick={() => navigate('/lop-hoc-moi')}>
                  <span>Khám phá lớp dạy kèm mới</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowSkillSection;
