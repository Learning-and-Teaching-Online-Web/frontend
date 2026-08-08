import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Globe, Code, Atom, BookOpen, Award, Music, Sparkles } from 'lucide-react';

const TopCategories: React.FC = () => {
  const navigate = useNavigate();

  const categoriesList = [
    { name: 'Toán Học', icon: Calculator, count: '120+ Lớp', query: 'Toán' },
    { name: 'Tiếng Anh & Ngoại Ngữ', icon: Globe, count: '150+ Lớp', query: 'Tiếng Anh' },
    { name: 'Lập Trình & CNTT', icon: Code, count: '85+ Lớp', query: 'Lập Trình' },
    { name: 'Vật Lý & Hóa Học', icon: Atom, count: '90+ Lớp', query: 'Vật Lý' },
    { name: 'Ngữ Văn & Lịch Sử', icon: BookOpen, count: '65+ Lớp', query: 'Văn' },
    { name: 'Luyện Thi Đại Học / Chuyên', icon: Award, count: '200+ Lớp', query: 'Luyện thi' },
    { name: 'Âm Nhạc & Nghệ Thuật', icon: Music, count: '45+ Lớp', query: 'Nghệ thuật' },
    { name: 'Kỹ Năng & Tin Học', icon: Sparkles, count: '70+ Lớp', query: 'Tin học' },
  ];

  const handleSelectCategory = (query: string) => {
    navigate(`/lop-hoc-moi?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="top-categories-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-title-group">
            <span className="section-subtitle">Danh Mục Môn Học</span>
            <h2 className="section-title">
              Các Môn Học <span>Được Quan Tâm Nhất</span>
            </h2>
          </div>
          <button className="section-header-btn" onClick={() => navigate('/lop-hoc-moi')}>
            Xem tất cả môn học
          </button>
        </div>

        <div className="categories-grid">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => handleSelectCategory(cat.query)}
              >
                <div className="category-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-courses-count">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
