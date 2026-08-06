import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, BookOpen, Video, GraduationCap, ArrowRight } from 'lucide-react';

const CoreServices: React.FC = () => {
  const services = [
    {
      id: 'find-tutor',
      icon: <UserCheck size={32} className="service-icon text-indigo" />,
      badge: 'Phổ biến nhất',
      title: 'Tìm Gia Sư 1-1 Cá Nhân Hóa',
      description: 'Đăng nhu cầu tìm gia sư dạy kèm tại nhà hoặc online. Được đề xuất gia sư giỏi phù hợp nhất trong 24h.',
      link: '/tim-gia-su',
      btnText: 'Đăng yêu cầu ngay',
      colorClass: 'service-card-indigo',
    },
    {
      id: 'open-classes',
      icon: <BookOpen size={32} className="service-icon text-amber" />,
      badge: 'Hot dành cho Gia sư',
      title: 'Lớp Học Mới Cần Gia Sư',
      description: 'Hàng trăm lớp học mới đang tuyển gia sư mỗi ngày với mức lương hấp dẫn và minh bạch thông tin.',
      link: '/lop-hoc-moi',
      btnText: 'Xem danh sách lớp',
      colorClass: 'service-card-amber',
    },
    {
      id: 'online-courses',
      icon: <Video size={32} className="service-icon text-emerald" />,
      badge: 'Học mọi lúc mọi nơi',
      title: 'Khóa Học Trực Tuyến',
      description: 'Hệ thống khóa học video bài giảng đa dạng từ các giảng viên hàng đầu, tự luyện bài tập và kiểm tra.',
      link: '/courses',
      btnText: 'Khám phá khóa học',
      colorClass: 'service-card-emerald',
    },
    {
      id: 'become-tutor',
      icon: <GraduationCap size={32} className="service-icon text-rose" />,
      badge: 'Thu nhập hấp dẫn',
      title: 'Trở Thành Gia Sư Uy Tín',
      description: 'Gia nhập đội ngũ gia sư NovaLearn, kết nối học viên dễ dàng, linh hoạt thời gian và gia tăng thu nhập.',
      link: '/auth?role=tutor',
      btnText: 'Đăng ký làm gia sư',
      colorClass: 'service-card-rose',
    },
  ];

  return (
    <section className="core-services-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">Dịch Vụ Cốt Lõi</span>
          <h2 className="section-title">
            Giải Pháp Học Tập & Giảng Dạy <span>Toàn Diện</span>
          </h2>
          <p className="section-description">
            NovaLearn kết nối trực tiếp Học viên & Phụ huynh với Đội ngũ Gia sư chất lượng cao, đồng thời cung cấp khóa học online chuẩn hóa.
          </p>
        </div>

        <div className="core-services-grid">
          {services.map((item) => (
            <div key={item.id} className={`service-card ${item.colorClass}`}>
              <div className="service-card-top">
                <div className="service-icon-box">{item.icon}</div>
                <span className="service-badge">{item.badge}</span>
              </div>
              <h3 className="service-card-title">{item.title}</h3>
              <p className="service-card-desc">{item.description}</p>
              <Link to={item.link} className="service-card-btn">
                <span>{item.btnText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreServices;
