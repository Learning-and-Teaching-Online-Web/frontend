import React from 'react';
import { Search, Star } from 'lucide-react';
import '../styles/SidebarFilters.css';

export interface FilterState {
  search: string;
  categories: string[];
  instructors: string[];
  priceTypes: ('free' | 'paid')[];
  ratings: number[];
  levels: string[];
}

interface SidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  courses?: any[];
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, onFilterChange, courses = [] }) => {
  const [categorySearch, setCategorySearch] = React.useState('');
  const [isCatExpanded, setIsCatExpanded] = React.useState(false);
  const [instructorSearch, setInstructorSearch] = React.useState('');
  const [isInstExpanded, setIsInstExpanded] = React.useState(false);

  // Extract dynamic categories & counts from actual courses
  const categoryMap = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    courses.forEach(c => {
      const subjectName = c.subject || c.category;
      if (subjectName) {
        map[subjectName] = (map[subjectName] || 0) + 1;
      }
      if (Array.isArray(c.categories)) {
        c.categories.forEach((cat: string) => {
          if (cat && cat !== subjectName) {
            map[cat] = (map[cat] || 0) + 1;
          }
        });
      }
    });
    return map;
  }, [courses]);

  // Sort categories by course count descending
  const availableCategories = React.useMemo(() => {
    const keys = Object.keys(categoryMap);
    if (keys.length === 0) {
      return ["Lập trình & Web", "Backend", "Cơ sở dữ liệu", "Toán", "Vật Lý", "Tiếng Anh"];
    }
    return keys.sort((a, b) => (categoryMap[b] || 0) - (categoryMap[a] || 0));
  }, [categoryMap]);

  // Filtered & collapsed categories
  const filteredCategories = React.useMemo(() => {
    let list = availableCategories;
    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase().trim();
      list = list.filter(cat => cat.toLowerCase().includes(q));
    }
    return list;
  }, [availableCategories, categorySearch]);

  const visibleCategories = React.useMemo(() => {
    if (categorySearch.trim() || isCatExpanded) {
      return filteredCategories;
    }
    const initialList = filteredCategories.slice(0, 4);
    // Keep checked categories visible even when collapsed
    filters.categories.forEach(checkedCat => {
      if (!initialList.includes(checkedCat) && filteredCategories.includes(checkedCat)) {
        initialList.push(checkedCat);
      }
    });
    return initialList;
  }, [filteredCategories, categorySearch, isCatExpanded, filters.categories]);

  // Extract dynamic instructors & counts
  const instructorMap = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    courses.forEach(c => {
      if (c.instructor) {
        map[c.instructor] = (map[c.instructor] || 0) + 1;
      }
    });
    return map;
  }, [courses]);

  const availableInstructors = React.useMemo(() => {
    return Object.keys(instructorMap).sort((a, b) => (instructorMap[b] || 0) - (instructorMap[a] || 0));
  }, [instructorMap]);

  const filteredInstructors = React.useMemo(() => {
    let list = availableInstructors;
    if (instructorSearch.trim()) {
      const q = instructorSearch.toLowerCase().trim();
      list = list.filter(inst => inst.toLowerCase().includes(q));
    }
    return list;
  }, [availableInstructors, instructorSearch]);

  const visibleInstructors = React.useMemo(() => {
    if (instructorSearch.trim() || isInstExpanded) {
      return filteredInstructors;
    }
    const initialList = filteredInstructors.slice(0, 4);
    filters.instructors.forEach(checkedInst => {
      if (!initialList.includes(checkedInst) && filteredInstructors.includes(checkedInst)) {
        initialList.push(checkedInst);
      }
    });
    return initialList;
  }, [filteredInstructors, instructorSearch, isInstExpanded, filters.instructors]);

  const getCategoryCount = (cat: string) => {
    return categoryMap[cat] || 0;
  };

  const getInstructorCount = (inst: string) => {
    return instructorMap[inst] || 0;
  };

  const getLevelCount = (lvl: string) => {
    return courses.filter(c => c.level === lvl).length;
  };

  const getPriceCount = (type: 'free' | 'paid') => {
    if (type === 'free') return courses.filter(c => c.isFree || c.price === 0).length;
    return courses.filter(c => !c.isFree && c.price > 0).length;
  };

  const getRatingCount = (stars: number) => {
    return courses.filter(c => Math.floor(c.rating || 5) === stars).length;
  };

  // Toggle checklist arrays
  const handleCheckboxChange = (
    key: keyof Omit<FilterState, 'search'>,
    value: any
  ) => {
    const currentList = filters[key] as any[];
    let newList;
    if (currentList.includes(value)) {
      newList = currentList.filter(item => item !== value);
    } else {
      newList = [...currentList, value];
    }
    onFilterChange({
      ...filters,
      [key]: newList
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };

  const renderStars = (rating: number) => {
    return (
      <span className="stars-row">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            fill={i < rating ? "#ffb800" : "none"} 
            color={i < rating ? "#ffb800" : "#cbd5e1"}
            style={{ marginRight: '1px' }} 
          />
        ))}
      </span>
    );
  };

  return (
    <aside className="sidebar-filters">
      {/* 1. Search Box */}
      <div className="search-filter-box">
        <input 
          type="text" 
          placeholder="Tìm kiếm khóa học..." 
          className="search-filter-input"
          value={filters.search}
          onChange={handleSearchChange}
        />
        <Search className="search-filter-icon" size={18} />
      </div>

      {/* 2. Course Category */}
      <div className="filter-group">
        <h3 className="filter-title">Danh mục khóa học</h3>

        {/* Mini Search Input for Categories */}
        {availableCategories.length > 4 && (
          <div style={{ marginBottom: '10px', position: 'relative' }}>
            <input 
              type="text"
              placeholder="Tìm nhanh danh mục..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 28px 6px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
            <Search size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>
        )}

        <div className="filter-options">
          {visibleCategories.map(cat => {
            const count = getCategoryCount(cat);
            return (
              <label key={cat} className="filter-checkbox-label">
                <div className="filter-checkbox-left">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox-input"
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleCheckboxChange('categories', cat)}
                  />
                  <span>{cat}</span>
                </div>
                <span className="filter-checkbox-count">{count}</span>
              </label>
            );
          })}
          {visibleCategories.length === 0 && (
            <div style={{ fontSize: '12px', color: '#94a3b8', padding: '6px 0' }}>
              Không tìm thấy danh mục
            </div>
          )}
        </div>

        {/* Toggle Show More / Show Less */}
        {!categorySearch && availableCategories.length > 4 && (
          <button
            onClick={() => setIsCatExpanded(!isCatExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '8px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isCatExpanded ? 'Thu gọn ▲' : `Xem thêm (${availableCategories.length - 4}) ▼`}
          </button>
        )}
      </div>

      {/* 3. Instructors */}
      {availableInstructors.length > 0 && (
        <div className="filter-group">
          <h3 className="filter-title">Giảng viên</h3>

          {/* Mini Search Input for Instructors */}
          {availableInstructors.length > 4 && (
            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <input 
                type="text"
                placeholder="Tìm giảng viên..."
                value={instructorSearch}
                onChange={(e) => setInstructorSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 28px 6px 10px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
              <Search size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          )}

          <div className="filter-options">
            {visibleInstructors.map(inst => {
              const count = getInstructorCount(inst);
              return (
                <label key={inst} className="filter-checkbox-label">
                  <div className="filter-checkbox-left">
                    <input 
                      type="checkbox" 
                      className="filter-checkbox-input"
                      checked={filters.instructors.includes(inst)}
                      onChange={() => handleCheckboxChange('instructors', inst)}
                    />
                    <span>{inst}</span>
                  </div>
                  <span className="filter-checkbox-count">{count}</span>
                </label>
              );
            })}
            {visibleInstructors.length === 0 && (
              <div style={{ fontSize: '12px', color: '#94a3b8', padding: '6px 0' }}>
                Không tìm thấy giảng viên
              </div>
            )}
          </div>

          {!instructorSearch && availableInstructors.length > 4 && (
            <button
              onClick={() => setIsInstExpanded(!isInstExpanded)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '8px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isInstExpanded ? 'Thu gọn ▲' : `Xem thêm (${availableInstructors.length - 4}) ▼`}
            </button>
          )}
        </div>
      )}

      {/* 4. Price */}
      <div className="filter-group">
        <h3 className="filter-title">Giá</h3>
        <div className="filter-options">
          <label className="filter-checkbox-label">
            <div className="filter-checkbox-left">
              <input 
                type="checkbox" 
                className="filter-checkbox-input"
                checked={filters.priceTypes.length === 0}
                onChange={() => onFilterChange({ ...filters, priceTypes: [] })}
              />
              <span>Tất cả</span>
            </div>
            <span className="filter-checkbox-count">{courses.length}</span>
          </label>
          <label className="filter-checkbox-label">
            <div className="filter-checkbox-left">
              <input 
                type="checkbox" 
                className="filter-checkbox-input"
                checked={filters.priceTypes.includes('free')}
                onChange={() => handleCheckboxChange('priceTypes', 'free')}
              />
              <span>Miễn phí</span>
            </div>
            <span className="filter-checkbox-count">{getPriceCount('free')}</span>
          </label>
          <label className="filter-checkbox-label">
            <div className="filter-checkbox-left">
              <input 
                type="checkbox" 
                className="filter-checkbox-input"
                checked={filters.priceTypes.includes('paid')}
                onChange={() => handleCheckboxChange('priceTypes', 'paid')}
              />
              <span>Trả phí</span>
            </div>
            <span className="filter-checkbox-count">{getPriceCount('paid')}</span>
          </label>
        </div>
      </div>

      {/* 5. Review */}
      <div className="filter-group">
        <h3 className="filter-title">Đánh giá</h3>
        <div className="filter-options">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = getRatingCount(stars);
            return (
              <label key={stars} className="filter-checkbox-label">
                <div className="filter-checkbox-left">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox-input"
                    checked={filters.ratings.includes(stars)}
                    onChange={() => handleCheckboxChange('ratings', stars)}
                  />
                  {renderStars(stars)}
                </div>
                <span className="filter-checkbox-count">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Level */}
      <div className="filter-group">
        <h3 className="filter-title">Trình độ</h3>
        <div className="filter-options">
          {["Beginner", "Intermediate", "Expert"].map(lvl => {
            const count = getLevelCount(lvl);
            return (
              <label key={lvl} className="filter-checkbox-label">
                <div className="filter-checkbox-left">
                  <input 
                    type="checkbox" 
                    className="filter-checkbox-input"
                    checked={filters.levels.includes(lvl)}
                    onChange={() => handleCheckboxChange('levels', lvl)}
                  />
                  <span>{lvl === 'Beginner' ? 'Cơ bản' : lvl === 'Intermediate' ? 'Trung cấp' : 'Chuyên gia'}</span>
                </div>
                <span className="filter-checkbox-count">{count}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
