import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Code, Globe, Video, Camera, TrendingUp, FileText, DollarSign, Atom, Share2 } from 'lucide-react';

const TopCategories: React.FC = () => {
  const navigate = useNavigate();
  const onSelectCategory = (_categoryName: string) => navigate('/courses');
  const onViewAll = () => navigate('/courses');
  const categoriesList = [
    { name: 'Art & Design', icon: Palette, count: 38 },
    { name: 'Development', icon: Code, count: 38 },
    { name: 'Communication', icon: Globe, count: 38 },
    { name: 'Videography', icon: Video, count: 38 },
    { name: 'Photography', icon: Camera, count: 38 },
    { name: 'Marketing', icon: TrendingUp, count: 38 },
    { name: 'Content Writing', icon: FileText, count: 38 },
    { name: 'Finance', icon: DollarSign, count: 38 },
    { name: 'Science', icon: Atom, count: 38 },
    { name: 'Network', icon: Share2, count: 38 }
  ];

  return (
    <section className="top-categories-section" style={{ padding: '80px 0 40px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Top Categories</h2>
            <p>Explore our Popular Categories</p>
          </div>
          <button className="section-header-btn" onClick={onViewAll}>
            All Categories
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
                <span className="category-courses-count">{cat.count} Courses</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TopCategories;
