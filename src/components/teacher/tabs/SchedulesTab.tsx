import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  MapPin,
  Video,
  Filter,
  Sparkles
} from 'lucide-react';
import { Pagination } from '../../Pagination';

interface SchedulesTabProps {
  classSessions?: any[];
  formatDateString: (s: string) => string;
}

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const VIETNAMESE_WEEKDAYS = [
  'Chủ Nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7'
];

const getStatusBadge = (status?: string) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'ongoing':
      return {
        label: 'Đang học',
        bg: '#ecfdf5',
        color: '#059669',
        border: '#a7f3d0',
        group: 'ongoing' as const
      };
    case 'upcoming':
    case 'scheduled':
      return {
        label: 'Sắp diễn ra',
        bg: '#eff6ff',
        color: '#2563eb',
        border: '#bfdbfe',
        group: 'upcoming' as const
      };
    case 'completed':
      return {
        label: 'Hoàn thành',
        bg: '#f3f4f6',
        color: '#4b5563',
        border: '#e5e7eb',
        group: 'completed' as const
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        bg: '#fef2f2',
        color: '#dc2626',
        border: '#fecaca',
        group: 'cancelled' as const
      };
    default:
      return {
        label: status || 'Chưa xác định',
        bg: '#f1f5f9',
        color: '#475569',
        border: '#cbd5e1',
        group: 'upcoming' as const
      };
  }
};

const formatTimeOnly = (iso: string) => {
  if (!iso) return '--:--';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '--:--';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  classSessions = [],
  formatDateString
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const safeSessions = useMemo(
    () => (Array.isArray(classSessions) ? classSessions : []),
    [classSessions]
  );

  // Unique course titles for dropdown filter
  const courseOptions = useMemo(() => {
    const titles = new Set<string>();
    safeSessions.forEach((s) => {
      if (s.course_title) titles.add(s.course_title);
    });
    return Array.from(titles);
  }, [safeSessions]);

  // Status counts (based on selected course)
  const statusCounts = useMemo(() => {
    const counts = { all: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 };
    safeSessions.forEach((s) => {
      if (selectedCourse !== 'all' && s.course_title !== selectedCourse) return;
      counts.all += 1;
      const badge = getStatusBadge(s.status);
      counts[badge.group] += 1;
    });
    return counts;
  }, [safeSessions, selectedCourse]);

  // Next active or upcoming session (for highlight banner)
  const nextSession = useMemo(() => {
    const active = safeSessions.filter((s) => {
      const g = getStatusBadge(s.status).group;
      return g === 'ongoing' || g === 'upcoming';
    });
    if (active.length === 0) return null;

    return [...active].sort((a, b) => {
      const aOngoing = getStatusBadge(a.status).group === 'ongoing' ? 0 : 1;
      const bOngoing = getStatusBadge(b.status).group === 'ongoing' ? 0 : 1;
      if (aOngoing !== bOngoing) return aOngoing - bOngoing;
      return new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime();
    })[0];
  }, [safeSessions]);

  // Filtered & chronologically sorted sessions
  const filteredSessions = useMemo(() => {
    return safeSessions
      .filter((s) => {
        if (selectedCourse !== 'all' && s.course_title !== selectedCourse) return false;
        if (statusFilter !== 'all' && getStatusBadge(s.status).group !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const aGroup = getStatusBadge(a.status).group;
        const bGroup = getStatusBadge(b.status).group;
        const order: Record<string, number> = { ongoing: 0, upcoming: 1, completed: 2, cancelled: 3 };
        if (order[aGroup] !== order[bGroup]) return order[aGroup] - order[bGroup];
        const diff = new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime();
        // Completed/cancelled: newest first; upcoming/ongoing: earliest first
        return aGroup === 'completed' || aGroup === 'cancelled' ? -diff : diff;
      });
  }, [safeSessions, selectedCourse, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourse, statusFilter, safeSessions.length]);

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: `Tất cả (${statusCounts.all})` },
    { key: 'upcoming', label: `Sắp diễn ra (${statusCounts.upcoming})` },
    { key: 'ongoing', label: `Đang học (${statusCounts.ongoing})` },
    { key: 'completed', label: `Hoàn thành (${statusCounts.completed})` },
    { key: 'cancelled', label: `Đã hủy (${statusCounts.cancelled})` }
  ];

  const today = new Date();

  const renderSessionCard = (session: any) => {
    const startDate = new Date(session.scheduled_start);
    const isValid = !isNaN(startDate.getTime());
    const dayNum = isValid ? String(startDate.getDate()).padStart(2, '0') : '--';
    const monthLabel = isValid ? `Thg ${startDate.getMonth() + 1}` : '--';
    const weekday = isValid ? VIETNAMESE_WEEKDAYS[startDate.getDay()] : '';
    const isTodaySession = isValid && isSameDay(startDate, today);

    const badge = getStatusBadge(session.status);
    const isJoinable = badge.group === 'upcoming' || badge.group === 'ongoing';
    const studentLabel =
      Array.isArray(session.students) && session.students.length > 0
        ? session.students.join(', ')
        : session.student_name || 'Chưa có học viên';
    const roomTargetId = session.schedule_id || session.session_id;

    return (
      <div
        key={session.session_id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: '14px',
          border: isTodaySession ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Date badge + Session Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 320px' }}>
          <div
            style={{
              minWidth: '68px',
              padding: '10px 8px',
              borderRadius: '12px',
              background: isTodaySession ? '#2563eb' : '#f1f5f9',
              color: isTodaySession ? '#ffffff' : '#1e293b',
              textAlign: 'center',
              lineHeight: 1.2
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85 }}>
              {isTodaySession ? 'Hôm nay' : weekday}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0' }}>{dayNum}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.85 }}>{monthLabel}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1d4ed8',
                  background: '#dbeafe',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                {session.title || 'Buổi học'}
              </span>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                {session.course_title || 'Khóa học'}
              </h3>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: '#475569'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                <Clock size={14} color="#64748b" />
                {formatTimeOnly(session.scheduled_start)} - {formatTimeOnly(session.scheduled_end)}
                {!isValid && ` (${formatDateString(session.scheduled_start)})`}
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} color="#6366f1" />
                {studentLabel}
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} color="#10b981" />
                {session.room_id || 'Chưa cấp phòng'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status Badge + Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`
            }}
          >
            {badge.label}
          </span>

          {isJoinable && roomTargetId && (
            <Link
              to={`/classroom/${roomTargetId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: badge.group === 'ongoing' ? '#059669' : '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Video size={15} />
              Vào phòng dạy
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="section-card" style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <h2>Lịch Giảng Dạy Online</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Theo dõi toàn bộ các buổi dạy theo trình tự thời gian và vào phòng học trực tuyến nhanh chóng.
        </p>
      </div>

      {safeSessions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1'
          }}
        >
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#475569' }}>Chưa có lịch dạy</h3>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            Hiện chưa có lịch giảng dạy nào được khởi tạo từ các khóa học của bạn.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Highlight: Next / Ongoing Session */}
          {nextSession && (
            <div
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                borderRadius: '16px',
                padding: '18px 22px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#bfdbfe'
                  }}
                >
                  <Sparkles size={14} />
                  {getStatusBadge(nextSession.status).group === 'ongoing'
                    ? 'Buổi học đang diễn ra'
                    : 'Buổi dạy tiếp theo'}
                </span>
                <div style={{ fontSize: '17px', fontWeight: 700 }}>
                  {nextSession.course_title} — {nextSession.title || 'Buổi học'}
                </div>
                <div style={{ fontSize: '13px', color: '#dbeafe', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>🕒 {formatDateString(nextSession.scheduled_start)}</span>
                  <span>👤 {nextSession.student_name || 'Chưa có học viên'}</span>
                </div>
              </div>

              {(nextSession.schedule_id || nextSession.session_id) && (
                <Link
                  to={`/classroom/${nextSession.schedule_id || nextSession.session_id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    color: '#1d4ed8',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <Video size={16} />
                  Vào phòng dạy ngay
                </Link>
              )}
            </div>
          )}

          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              background: '#ffffff',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Status Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {filterTabs.map((tab) => {
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      background: active ? '#2563eb' : '#f8fafc',
                      color: active ? '#ffffff' : '#475569',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Course Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="#64748b" />
              <BookOpen size={15} color="#64748b" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#1e293b',
                  background: '#ffffff',
                  minWidth: '200px'
                }}
              >
                <option value="all">Tất cả khóa học ({courseOptions.length})</option>
                {courseOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline Session List */}
          {filteredSessions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px dashed #cbd5e1',
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              Không có buổi dạy nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paginatedSessions.map(renderSessionCard)}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
