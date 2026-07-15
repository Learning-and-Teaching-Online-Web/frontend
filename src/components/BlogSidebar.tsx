import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { mockCategories, mockTags, mockRecentPosts } from '../data/blogData';

interface BlogSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onToggleCategory,
  selectedTag,
  onSelectTag
}) => {

  const renderThumbnail = (imageType: 'globe' | 'classroom' | 'office') => {
    switch (imageType) {
      case 'globe':
        return (
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#e0f2fe" />
            <circle cx="40" cy="45" r="18" fill="#38bdf8" />
            <path d="M22 45 C22 45, 30 40, 40 45 C50 50, 58 45, 58 45" stroke="#0284c7" strokeWidth="2.5" />
            <path d="M 28 35 L 40 28 L 52 35 L 40 42 Z" fill="#1e3a8a" />
            <path d="M 52 35 L 52 50" stroke="#1e3a8a" strokeWidth="2" />
          </svg>
        );
      case 'classroom':
        return (
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#fef3c7" />
            <rect x="20" y="20" width="40" height="25" rx="2" fill="#065f46" />
            <line x1="40" x2="40" y1="45" y2="60" stroke="#b45309" strokeWidth="3" />
            <line x1="30" x2="50" y1="60" y2="60" stroke="#b45309" strokeWidth="4" />
          </svg>
        );
      case 'office':
        return (
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#f3e8ff" />
            <rect x="25" y="25" width="30" height="20" rx="1" fill="#4b5563" />
            <rect x="28" y="28" width="24" height="14" fill="#a78bfa" />
            <path d="M 20 46 L 60 46 L 65 52 L 15 52 Z" fill="#9ca3af" />
          </svg>
        );
    }
  };

  return (
    <aside className="sidebar-filters">
      {/* 1. Search Box (styled like Courses) */}
      <div className="search-filter-box">
        <input
          type="text"
          className="search-filter-input"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="search-filter-icon" size={18} />
      </div>

      {/* 2. Category Widget (styled with Checkboxes like Courses) */}
      <div className="filter-group">
        <h3 className="filter-title">Category</h3>
        <div className="filter-options">
          {mockCategories.map((cat, idx) => (
            <label key={idx} className="filter-checkbox-label">
              <div className="filter-checkbox-left">
                <input
                  type="checkbox"
                  className="filter-checkbox-input"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => onToggleCategory(cat.name)}
                />
                <span>{cat.name}</span>
              </div>
              <span className="filter-checkbox-count">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Recent Posts Widget */}
      <div className="filter-group">
        <h3 className="filter-title">Recent Posts</h3>
        <div className="recent-posts-list" style={{ marginTop: '12px' }}>
          {mockRecentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="recent-post-item"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <div className="recent-post-thumb">
                {renderThumbnail(post.imageType)}
              </div>
              <div className="recent-post-info">
                <h4 className="recent-post-title">{post.title}</h4>
                <span className="recent-post-date">
                  <Calendar size={12} style={{ color: 'var(--primary)' }} />
                  {post.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Tags Widget */}
      <div className="filter-group" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h3 className="filter-title">Tags</h3>
        <div className="sidebar-tags-container" style={{ marginTop: '12px' }}>
          <button
            className={`sidebar-tag-btn ${selectedTag === null ? 'active' : ''}`}
            onClick={() => onSelectTag(null)}
          >
            All Tags
          </button>
          {mockTags.map((tag, idx) => (
            <button
              key={idx}
              className={`sidebar-tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => onSelectTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
