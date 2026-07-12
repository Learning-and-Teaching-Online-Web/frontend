import React from 'react';
import { Search, Star } from 'lucide-react';
import { mockCourses } from '../data/mockData';
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
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, onFilterChange }) => {
  // Count course properties dynamically for badge counts
  const getCategoryCount = (cat: string) => {
    return mockCourses.filter(c => c.categories.includes(cat)).length;
  };

  const getInstructorCount = (inst: string) => {
    return mockCourses.filter(c => c.instructor === inst).length;
  };

  const getLevelCount = (lvl: string) => {
    return mockCourses.filter(c => c.level === lvl).length;
  };

  const getPriceCount = (type: 'free' | 'paid') => {
    if (type === 'free') return mockCourses.filter(c => c.isFree).length;
    return mockCourses.filter(c => !c.isFree).length;
  };

  const getRatingCount = (stars: number) => {
    return mockCourses.filter(c => c.rating === stars).length;
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
          placeholder="Search courses..." 
          className="search-filter-input"
          value={filters.search}
          onChange={handleSearchChange}
        />
        <Search className="search-filter-icon" size={18} />
      </div>

      {/* 2. Course Category */}
      <div className="filter-group">
        <h3 className="filter-title">Course Category</h3>
        <div className="filter-options">
          {["Academy", "Commercial", "Office", "Shop", "Studio", "University"].map(cat => {
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
        </div>
      </div>

      {/* 3. Instructors */}
      <div className="filter-group">
        <h3 className="filter-title">Instructors</h3>
        <div className="filter-options">
          {["Kenny White", "John Doe", "Determined-Poitras"].map(inst => {
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
        </div>
      </div>

      {/* 4. Price */}
      <div className="filter-group">
        <h3 className="filter-title">Price</h3>
        <div className="filter-options">
          <label className="filter-checkbox-label">
            <div className="filter-checkbox-left">
              <input 
                type="checkbox" 
                className="filter-checkbox-input"
                checked={filters.priceTypes.length === 0}
                onChange={() => onFilterChange({ ...filters, priceTypes: [] })}
              />
              <span>All</span>
            </div>
            <span className="filter-checkbox-count">{mockCourses.length}</span>
          </label>
          <label className="filter-checkbox-label">
            <div className="filter-checkbox-left">
              <input 
                type="checkbox" 
                className="filter-checkbox-input"
                checked={filters.priceTypes.includes('free')}
                onChange={() => handleCheckboxChange('priceTypes', 'free')}
              />
              <span>Free</span>
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
              <span>Paid</span>
            </div>
            <span className="filter-checkbox-count">{getPriceCount('paid')}</span>
          </label>
        </div>
      </div>

      {/* 5. Review */}
      <div className="filter-group">
        <h3 className="filter-title">Review</h3>
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
        <h3 className="filter-title">Level</h3>
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
                  <span>{lvl}</span>
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
