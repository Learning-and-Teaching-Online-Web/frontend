import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockArticles } from '../data/blogData';
import type { Article } from '../data/blogData';
import BlogSidebar from '../components/BlogSidebar';
import '../styles/Blog.css';

export const renderBlogIllustration = (type: Article['imageType']) => {
  switch (type) {
    case 'globe':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#e0f2fe" />
          {/* Globe */}
          <circle cx="110" cy="120" r="45" fill="#38bdf8" />
          <path d="M75 105 Q 110 95 145 105 Q 110 115 75 105" fill="#0284c7" opacity="0.6" />
          <path d="M70 125 Q 110 115 150 125 Q 110 135 70 125" fill="#0284c7" opacity="0.6" />
          <path d="M80 145 Q 110 135 140 145 Q 110 155 80 145" fill="#0284c7" opacity="0.6" />
          <path d="M110 75 Q 100 120 110 165" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          <path d="M110 75 Q 120 120 110 165" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          {/* Graduation Cap */}
          <path d="M70 80 L 110 65 L 150 80 L 110 95 Z" fill="#1e3a8a" />
          <rect x="98" y="85" width="24" height="12" fill="#1e3a8a" />
          <path d="M150 80 L 150 100" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="150" cy="100" r="3" fill="#f59e0b" />
          
          {/* Laptop / Browser */}
          <rect x="200" y="80" width="160" height="100" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="200" y="80" width="160" height="18" rx="2" fill="#e2e8f0" />
          <circle cx="210" cy="89" r="3" fill="#ef4444" />
          <circle cx="218" cy="89" r="3" fill="#f59e0b" />
          <circle cx="226" cy="89" r="3" fill="#10b981" />
          
          {/* Logo EDUMA */}
          <rect x="235" y="115" width="90" height="30" rx="3" fill="#ff7a3d" />
          <text x="250" y="135" fill="#ffffff" fontFamily="var(--outfit)" fontSize="13" fontWeight="800">EDUMA</text>
          <path d="M 223 130 L 230 122 L 237 130 L 230 138 Z" fill="#ffffff" />
          
          {/* Certificate */}
          <rect x="300" y="125" width="45" height="60" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(8 300 125)" />
          <line x1="305" y1="140" x2="335" y2="144" stroke="#cbd5e1" strokeWidth="2" transform="rotate(8 300 125)" />
          <line x1="305" y1="150" x2="335" y2="154" stroke="#cbd5e1" strokeWidth="2" transform="rotate(8 300 125)" />
          <circle cx="320" cy="165" r="5" fill="#ef4444" transform="rotate(8 300 125)" />
        </svg>
      );
    case 'classroom':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#fffbeb" />
          {/* Blackboard */}
          <rect x="180" y="30" width="180" height="90" rx="4" fill="#064e3b" stroke="#d97706" strokeWidth="4" />
          <line x1="200" y1="60" x2="250" y2="60" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="210" cy="80" r="10" stroke="#a7f3d0" strokeWidth="2" fill="none" />
          <line x1="290" y1="70" x2="330" y2="70" stroke="#a7f3d0" strokeWidth="2" />
          <line x1="290" y1="85" x2="310" y2="85" stroke="#a7f3d0" strokeWidth="2" />

          {/* Student at blackboard */}
          <circle cx="130" cy="75" r="15" fill="#fbcfe8" />
          <path d="M 115 130 L 115 90 Q 130 85 145 90 L 145 130 Z" fill="#db2777" />
          <path d="M 140 100 Q 165 80 185 70" stroke="#fbcfe8" strokeWidth="6" strokeLinecap="round" fill="none" /> {/* Arm pointing */}

          {/* Desk / Laptop & Businessman */}
          <rect x="40" y="150" width="160" height="10" fill="#b45309" rx="2" />
          <line x1="60" y1="160" x2="60" y2="220" stroke="#b45309" strokeWidth="4" />
          <line x1="180" y1="160" x2="180" y2="220" stroke="#b45309" strokeWidth="4" />
          
          {/* Laptop */}
          <path d="M 120 150 L 160 150 L 165 135 L 125 135 Z" fill="#94a3b8" />
          <path d="M 115 150 L 165 150 L 170 153 L 110 153 Z" fill="#cbd5e1" />
          
          {/* Man Sitting */}
          <circle cx="85" cy="115" r="13" fill="#fed7aa" />
          <path d="M 70 150 L 70 128 Q 85 125 100 128 L 100 150 Z" fill="#2563eb" />
          <path d="M 92 135 Q 115 145 125 150" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case 'office':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#f1f5f9" />
          
          {/* Office window/background */}
          <rect x="50" y="20" width="300" height="120" fill="#e2e8f0" rx="4" />
          <line x1="150" y1="20" x2="150" y2="140" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="250" y1="20" x2="250" y2="140" stroke="#cbd5e1" strokeWidth="2" />

          {/* Man sitting in background */}
          <circle cx="100" cy="90" r="10" fill="#ffedd5" />
          <path d="M 85 140 L 85 100 Q 100 98 115 100 L 115 140 Z" fill="#475569" />
          <rect x="110" y="110" width="30" height="20" fill="#cbd5e1" />

          {/* Woman Standing in Foreground */}
          <circle cx="260" cy="70" r="18" fill="#ffe4e6" />
          {/* Hair */}
          <path d="M 242 70 C 242 40, 278 40, 278 70 C 278 85, 242 85, 242 70 Z" fill="#b45309" />
          {/* Shirt */}
          <path d="M 230 220 L 235 110 Q 260 98 285 110 L 290 220 Z" fill="#0891b2" />
          {/* Blazer */}
          <path d="M 230 110 L 245 220 L 230 220 Z" fill="#0f172a" />
          <path d="M 290 110 L 275 220 L 290 220 Z" fill="#0f172a" />
          
          {/* Glasses */}
          <rect x="250" y="65" width="8" height="6" stroke="#000000" strokeWidth="1" fill="none" />
          <rect x="262" y="65" width="8" height="6" stroke="#000000" strokeWidth="1" fill="none" />
          <line x1="258" y1="68" x2="262" y2="68" stroke="#000000" strokeWidth="1" />

          {/* Phone hand */}
          <path d="M 285 115 Q 305 105 300 95" stroke="#ffe4e6" strokeWidth="5" strokeLinecap="round" fill="none" />
          <rect x="296" y="90" width="6" height="12" rx="1" fill="#1e293b" />
        </svg>
      );
    case 'tablet':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#faf7f2" />
          
          {/* Drawing Tablet */}
          <rect x="80" y="30" width="240" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="4" />
          <rect x="95" y="40" width="210" height="130" rx="3" fill="#0284c7" />
          
          {/* Vector Drawing on Tablet */}
          <path d="M 120 140 Q 200 40 280 140" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="200" cy="90" r="6" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
          <line x1="160" y1="120" x2="200" y2="90" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="240" y1="120" x2="200" y2="90" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
          
          {/* Color Palettes on screen */}
          <rect x="270" y="50" width="25" height="12" fill="#ef4444" rx="1" />
          <rect x="270" y="66" width="25" height="12" fill="#10b981" rx="1" />
          <rect x="270" y="82" width="25" height="12" fill="#f59e0b" rx="1" />

          {/* Hand with Stylus drawing */}
          <path d="M 260 220 L 220 140 L 235 130 L 280 190 Z" fill="#ffe4e6" />
          <line x1="210" y1="125" x2="245" y2="155" stroke="#000000" strokeWidth="4" strokeLinecap="round" /> {/* Stylus */}
          <path d="M 210 125 L 206 122 L 209 127 Z" fill="#475569" /> {/* Stylus Tip */}
        </svg>
      );
    case 'child':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#ecfeff" />
          
          {/* Laptop Screen */}
          <rect x="80" y="20" width="240" height="160" rx="6" fill="#1f2937" />
          <rect x="90" y="30" width="220" height="130" rx="2" fill="#164e63" />
          
          {/* Child in screen waving */}
          <circle cx="200" cy="80" r="22" fill="#ffedd5" />
          {/* Hair */}
          <path d="M 175 75 Q 200 50 225 75" stroke="#b45309" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Shirt */}
          <path d="M 165 140 L 175 110 Q 200 100 225 110 L 235 140 Z" fill="#ea580c" />
          {/* Waving Hand */}
          <path d="M 230 115 Q 255 95 250 80" stroke="#ffedd5" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="250" cy="76" r="4" fill="#ffedd5" />

          {/* Laptop Base */}
          <path d="M 50 190 L 350 190 L 370 205 L 30 205 Z" fill="#cbd5e1" />
          <rect x="175" y="193" width="50" height="6" rx="2" fill="#94a3b8" /> {/* Trackpad */}
          
          {/* Sticky Notes on desk */}
          <rect x="60" y="200" width="20" height="15" fill="#fde047" rx="1" transform="rotate(-5 60 200)" />
          <rect x="90" y="198" width="20" height="15" fill="#a7f3d0" rx="1" transform="rotate(5 90 198)" />
        </svg>
      );
    case 'library':
      return (
        <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="220" fill="#f0fdf4" />
          
          {/* Bookshelf Background */}
          <g opacity="0.4" stroke="#bbf7d0" strokeWidth="2">
            <line x1="50" y1="20" x2="50" y2="200" />
            <line x1="90" y1="20" x2="90" y2="200" />
            <line x1="310" y1="20" x2="310" y2="200" />
            <line x1="350" y1="20" x2="350" y2="200" />
            
            {/* Shelf boards */}
            <line x1="30" y1="60" x2="110" y2="60" strokeWidth="3" />
            <line x1="30" y1="120" x2="110" y2="120" strokeWidth="3" />
            <line x1="30" y1="180" x2="110" y2="180" strokeWidth="3" />
            <line x1="290" y1="60" x2="370" y2="60" strokeWidth="3" />
            <line x1="290" y1="120" x2="370" y2="120" strokeWidth="3" />
            <line x1="290" y1="180" x2="370" y2="180" strokeWidth="3" />
          </g>

          {/* Student Reading in Hallway */}
          <circle cx="200" cy="65" r="18" fill="#ffe4e6" />
          {/* Hair (long) */}
          <path d="M 182 65 C 182 40, 218 40, 218 65 C 218 100, 182 100, 182 65 Z" fill="#1e293b" />
          
          {/* Glasses */}
          <rect x="193" y="60" width="6" height="5" stroke="#ffffff" strokeWidth="1" />
          <rect x="201" y="60" width="6" height="5" stroke="#ffffff" strokeWidth="1" />
          
          {/* Clothes */}
          <path d="M 175 220 L 180 105 Q 200 95 220 105 L 225 220 Z" fill="#db2777" />
          {/* Collar */}
          <path d="M 190 105 L 200 115 L 210 105 Z" fill="#ffe4e6" />

          {/* Book in hand */}
          <path d="M 185 140 Q 200 128 215 140 L 210 160 Q 200 148 190 160 Z" fill="#f59e0b" />
          <path d="M 190 142 L 210 142 L 205 158 L 195 158 Z" fill="#ffffff" /> {/* Pages */}
          <path d="M 172 152 Q 185 145 190 145" stroke="#ffe4e6" strokeWidth="4" strokeLinecap="round" /> {/* Hand */}
          <path d="M 228 152 Q 215 145 210 145" stroke="#ffe4e6" strokeWidth="4" strokeLinecap="round" /> {/* Hand */}
        </svg>
      );
  }
};

const BlogList: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('default');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Reset page number on filter changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPageNum(1);
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPageNum(1);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPageNum(1);
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return mockArticles.filter(article => {
      // 1. Search text check (title + excerpt)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(query);
        if (!matchesTitle && !matchesExcerpt) return false;
      }
      // 2. Categories check (OR logic: match any of the selected categories)
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(article.category)) return false;
      }
      // 3. Tag check
      if (selectedTag) {
        if (!article.tags.includes(selectedTag)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategories, selectedTag]);

  // Sorted Articles
  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];
    if (sortBy === 'comments-desc') {
      return list.sort((a, b) => b.commentsCount - a.commentsCount);
    } else if (sortBy === 'title-asc') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list; // default mock sorting
  }, [filteredArticles, sortBy]);

  // Paginated articles (4 per page)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage) || 1;

  const paginatedArticles = useMemo(() => {
    const from = (currentPageNum - 1) * itemsPerPage;
    const to = from + itemsPerPage;
    return sortedArticles.slice(from, to);
  }, [sortedArticles, currentPageNum]);

  return (
    <div className="blog-list-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Bài viết</span>
        </div>
      </div>

      <div className="container">
        {/* Title */}
        <div className="listing-title-section" style={{ padding: '40px 0 20px 0' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--outfit)', color: 'var(--text-dark)' }}>Tất cả bài viết</h1>
        </div>
        
        {/* Layout split with Left Sidebar */}
        <div className="blog-layout-wrapper">
          
          {/* Left Column: Sidebar Filters (styled like Courses) */}
          <BlogSidebar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            selectedTag={selectedTag}
            onSelectTag={handleTagSelect}
          />

          {/* Right Column: Main Articles Content */}
          <div className="blog-main-content">
            
            {/* Control Bar (styled EXACTLY like Courses) */}
            <div className="blog-control-bar">
              <span className="results-count">
                Hiển thị {sortedArticles.length > 0 ? (currentPageNum - 1) * itemsPerPage + 1 : 0}-
                {Math.min(currentPageNum * itemsPerPage, sortedArticles.length)} trong tổng số {sortedArticles.length} kết quả
              </span>
              
              <div className="blog-control-bar-right">
                {/* Sort selector */}
                <select 
                  className="sort-select" 
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPageNum(1); }}
                >
                  <option value="default">Mặc định</option>
                  <option value="comments-desc">Nhiều bình luận nhất</option>
                  <option value="title-asc">Tiêu đề: A đến Z</option>
                </select>

                {/* Grid / List Layout switches */}
                <div className="layout-toggle-buttons">
                  <button 
                    className={`layout-btn ${layout === 'grid' ? 'active' : ''}`}
                    onClick={() => setLayout('grid')}
                    aria-label="Giao diện dạng lưới"
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    className={`layout-btn ${layout === 'list' ? 'active' : ''}`}
                    onClick={() => setLayout('list')}
                    aria-label="Giao diện dạng danh sách"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Grid / List */}
            {paginatedArticles.length > 0 ? (
              <div className={`blog-grid ${layout === 'list' ? 'list-view' : ''}`}>
                {paginatedArticles.map((article) => (
                  <article className="blog-card" key={article.id}>
                    <Link to={`/blog/${article.id}`} className="blog-card-image" style={{ display: 'block', cursor: 'pointer' }}>
                      {renderBlogIllustration(article.imageType)}
                    </Link>
                    
                    <div className="blog-card-content">
                      {/* Meta info */}
                      <div className="blog-card-meta">
                        <span className="meta-item">
                          <Calendar size={13} style={{ color: 'var(--primary)' }} />
                          {article.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="blog-card-title">
                        <Link to={`/blog/${article.id}`}>
                          {article.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="blog-card-excerpt">{article.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Không tìm thấy bài viết nào phù hợp với bộ lọc tìm kiếm.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: '50px' }}>
                <button 
                  className="pagination-btn"
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum(prev => Math.max(prev - 1, 1))}
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    className={`pagination-btn ${currentPageNum === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPageNum(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  className="pagination-btn"
                  disabled={currentPageNum === totalPages}
                  onClick={() => setCurrentPageNum(prev => Math.min(prev + 1, totalPages))}
                  aria-label="Trang tiếp"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogList;
