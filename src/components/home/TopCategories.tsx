import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Globe, Video, Camera, TrendingUp, FileText, DollarSign, Atom, Share2 } from 'lucide-react';

const TopCategories: React.FC = () => {
  const navigate = useNavigate();
  const onSelectCategory = (_categoryName: string) => navigate('/courses');
  const onViewAll = () => navigate('/courses');
  const categoriesList = [
    { name: 'Nghệ thuật & Thiết kế', icon: Palette, count: 38 },
    { name: 'Phát triển phần mềm', icon: Code, count: 38 },
    { name: 'Giao tiếp', icon: Globe, count: 38 },
    { name: 'Quay phim', icon: Video, count: 38 },
    { name: 'Nhiếp ảnh', icon: Camera, count: 38 },
    { name: 'Marketing', icon: TrendingUp, count: 38 },
    { name: 'Viết nội dung', icon: FileText, count: 38 },
    { name: 'Tài chính', icon: DollarSign, count: 38 },
    { name: 'Khoa học', icon: Atom, count: 38 },
    { name: 'Mạng máy tính', icon: Share2, count: 38 }
  ];

  return (
    <section className="top-categories-section" style={{ padding: '80px 0 40px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Danh mục hàng đầu</h2>
            <p>Khám phá các danh mục phổ biến của chúng tôi</p>
          </div>
          <button className="section-header-btn" onClick={onViewAll}>
            Tất cả danh mục
          </button>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => onSelectCategory(cat.name)}
              >
                <div className="category-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-courses-count">{cat.count} Khóa học</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TopCategories;
