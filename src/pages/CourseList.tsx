import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { courseApi, mapBackendCourseToFrontend } from '../services/courseApi';
import SidebarFilters from '../components/SidebarFilters';
import type { FilterState } from '../components/SidebarFilters';
import CourseCard from '../components/CourseCard';
import '../styles/CourseList.css';

const CourseList: React.FC = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    instructors: [],
    priceTypes: [],
    ratings: [],
    levels: []
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await courseApi.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBackendCourseToFrontend);
          setCourses(mapped);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses from backend:', err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 on filter
  };

  // 1. Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search text
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Categories (OR logic: match any of the selected categories)
      if (filters.categories.length > 0) {
        const hasMatchingCat = course.categories.some((cat: string) => filters.categories.includes(cat));
        if (!hasMatchingCat) return false;
      }

      // Instructors
      if (filters.instructors.length > 0) {
        if (!filters.instructors.includes(course.instructor)) return false;
      }

      // Price type
      if (filters.priceTypes.length > 0) {
        const isFreeMatch = filters.priceTypes.includes('free') && course.isFree;
        const isPaidMatch = filters.priceTypes.includes('paid') && !course.isFree;
        if (!isFreeMatch && !isPaidMatch) return false;
      }

      // Ratings
      if (filters.ratings.length > 0) {
        if (!filters.ratings.includes(course.rating)) return false;
      }

      // Levels
      if (filters.levels.length > 0) {
        if (!filters.levels.includes(course.level)) return false;
      }

      return true;
    });
  }, [courses, filters]);

  // 2. Sort courses
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'students') {
      return list.sort((a, b) => b.studentsCount - a.studentsCount);
    }
    return list; // Default sorting (insertion order)
  }, [filteredCourses, sortBy]);

  // 3. Paginate courses
  const itemsPerPage = 4; // Mock items per page
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage) || 1;

  const paginatedCourses = useMemo(() => {
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage;
    return sortedCourses.slice(from, to);
  }, [sortedCourses, currentPage]);

  return (
    <main className="main-content">
      {/* Breadcrumbs Header */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">Khóa học</span>
        </div>
      </div>

      <div className="container">
        {/* Title */}
        <div className="listing-title-section">
          <h1 className="listing-title">Tất cả khóa học</h1>
        </div>

        {/* Layout Bipartite Split */}
        <div className="layout-wrapper">

          {/* Left Column (Filters) */}
          <SidebarFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            courses={courses}
          />

          {/* Right Column (Courses + Control) */}
          <div className="listing-content">

            {/* Control Bar */}
            <div className="control-bar">
              <span className="results-count">
                Hiển thị {sortedCourses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                {Math.min(currentPage * itemsPerPage, sortedCourses.length)} trong tổng số {sortedCourses.length} kết quả
              </span>

              <div className="control-bar-right">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  className="search-input"
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                {/* Sort */}
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá (Thấp đến cao)</option>
                  <option value="price-desc">Giá (Cao đến thấp)</option>
                  <option value="rating">Đánh giá tốt nhất</option>
                  <option value="students">Nhiều học viên nhất</option>
                </select>

                {/* Grid / List switches */}
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

            {/* Course Cards Grid */}
            {isLoading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
                Đang tải danh sách khóa học từ hệ thống...
              </div>
            ) : paginatedCourses.length > 0 ? (
              <div className={`course-grid ${layout === 'list' ? 'list-view' : ''}`}>
                {paginatedCourses.map(course => (
                  <CourseCard
                    key={course.course_id}
                    course={course}
                    layout={layout}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Không tìm thấy khóa học nào phù hợp với bộ lọc đã chọn.
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  aria-label="Trang tiếp"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
};

export default CourseList;
