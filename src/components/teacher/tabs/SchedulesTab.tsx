import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, BookOpen, User, Calendar, Clock, MapPin } from 'lucide-react';

interface SchedulesTabProps {
  classSessions?: any[];
  formatDateString: (s: string) => string;
}

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  classSessions = [],
  formatDateString
}) => {
  // State for tracking which course and which student are expanded
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());

  // Group the data: Course -> Student -> Sessions
  const groupedData = useMemo(() => {
    const data: Record<string, Record<string, any[]>> = {};

    classSessions.forEach((session) => {
      const courseTitle = session.course_title || 'Khóa học không xác định';
      const studentName = session.student_name || 'Học sinh';

      if (!data[courseTitle]) {
        data[courseTitle] = {};
      }
      if (!data[courseTitle][studentName]) {
        data[courseTitle][studentName] = [];
      }
      data[courseTitle][studentName].push(session);
    });

    return data;
  }, [classSessions]);

  const toggleCourse = (course: string) => {
    const newSet = new Set(expandedCourses);
    if (newSet.has(course)) {
      newSet.delete(course);
    } else {
      newSet.add(course);
    }
    setExpandedCourses(newSet);
  };

  const toggleStudent = (courseStudentKey: string) => {
    const newSet = new Set(expandedStudents);
    if (newSet.has(courseStudentKey)) {
      newSet.delete(courseStudentKey);
    } else {
      newSet.add(courseStudentKey);
    }
    setExpandedStudents(newSet);
  };

  const hasData = Object.keys(groupedData).length > 0;

  return (
    <div className="section-card" style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <h2>Lịch Học Thực Tế (Class Sessions)</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Quản lý chi tiết các buổi học theo từng khóa học và học viên.</p>
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#475569' }}>Chưa có lịch học</h3>
          <p style={{ margin: 0, color: '#94a3b8' }}>Chưa có lịch học thực tế nào được sinh ra từ các đăng ký học.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(groupedData).map(([courseTitle, studentsObj]) => {
            const isCourseExpanded = expandedCourses.has(courseTitle);
            const totalStudents = Object.keys(studentsObj).length;
            
            // Calculate total sessions across all students in this course
            const totalSessionsInCourse = Object.values(studentsObj).reduce((acc, sessions) => acc + sessions.length, 0);

            return (
              <div key={courseTitle} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                {/* Level 1: Course Header */}
                <div 
                  onClick={() => toggleCourse(courseTitle)}
                  style={{ 
                    padding: '16px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isCourseExpanded ? '#eff6ff' : '#fff',
                    borderBottom: isCourseExpanded ? '1px solid #e2e8f0' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{courseTitle}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                        {totalStudents} Học viên • {totalSessionsInCourse} Tổng buổi học
                      </p>
                    </div>
                  </div>
                  <div>
                    {isCourseExpanded ? <ChevronDown size={20} color="#64748b" /> : <ChevronRight size={20} color="#64748b" />}
                  </div>
                </div>

                {/* Level 2: Students List */}
                {isCourseExpanded && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fcfcfc' }}>
                    {Object.entries(studentsObj).map(([studentName, sessions]) => {
                      const courseStudentKey = `${courseTitle}-${studentName}`;
                      const isStudentExpanded = expandedStudents.has(courseStudentKey);

                      return (
                        <div key={courseStudentKey} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                          {/* Student Header */}
                          <div 
                            onClick={() => toggleStudent(courseStudentKey)}
                            style={{ 
                              padding: '12px 16px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              background: isStudentExpanded ? '#f8fafc' : '#fff',
                              borderBottom: isStudentExpanded ? '1px solid #e2e8f0' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={16} color="#4f46e5" />
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#334155' }}>Học viên: {studentName}</h4>
                                <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 500 }}>{sessions.length} Buổi học</span>
                              </div>
                            </div>
                            <div>
                              {isStudentExpanded ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronRight size={18} color="#94a3b8" />}
                            </div>
                          </div>

                          {/* Level 3: Sessions Table */}
                          {isStudentExpanded && (
                            <div style={{ padding: '0', overflowX: 'auto' }}>
                              <table className="db-table" style={{ margin: 0, border: 'none', borderTop: 'none', borderRadius: 0, width: '100%' }}>
                                <thead>
                                  <tr>
                                    <th style={{ background: '#f8fafc', padding: '12px 16px', fontSize: '13px' }}>Buổi học</th>
                                    <th style={{ background: '#f8fafc', padding: '12px 16px', fontSize: '13px' }}>Bắt đầu</th>
                                    <th style={{ background: '#f8fafc', padding: '12px 16px', fontSize: '13px' }}>Kết thúc</th>
                                    <th style={{ background: '#f8fafc', padding: '12px 16px', fontSize: '13px' }}>Phòng học</th>
                                    <th style={{ background: '#f8fafc', padding: '12px 16px', fontSize: '13px' }}>Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sessions.map((session: any) => (
                                    <tr key={session.session_id}>
                                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{session.title}</td>
                                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <Clock size={14} color="#64748b" />
                                          <span>{formatDateString(session.scheduled_start)}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <Clock size={14} color="#64748b" />
                                          <span>{formatDateString(session.scheduled_end)}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <MapPin size={14} color="#10b981" />
                                          <span>{session.room_id || '-'}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px 16px' }}>
                                        <span className={`badge ${session.status === 'scheduled' ? 'badge-confirmed' : 'badge-draft'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                          {session.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
