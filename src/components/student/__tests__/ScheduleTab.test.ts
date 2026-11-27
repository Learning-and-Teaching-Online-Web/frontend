import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ScheduleTab, getStatusBadgeInfo } from '../tabs/ScheduleTab';
import type { ClassSession } from '../../../data/mockStudentData';

describe('ScheduleTab Component', () => {
  // Mock dữ liệu 5 buổi học với các trạng thái khác nhau (upcoming, ongoing, completed)
  const mockFiveSessions: ClassSession[] = [
    {
      session_id: 'sess-001',
      courseTitle: 'Toán Cao Cấp A1',
      tutorName: 'Nguyễn Văn A',
      tutorAvatar: 'https://example.com/avatar1.jpg',
      startTime: '2026-12-10T19:30:00Z',
      endTime: '2026-12-10T21:00:00Z',
      status: 'upcoming',
      meetingLink: 'https://meet.jit.si/novalearn-sess-001'
    },
    {
      session_id: 'sess-002',
      courseTitle: 'Vật Lý Đại Cương',
      tutorName: 'Trần Thị B',
      tutorAvatar: 'https://example.com/avatar2.jpg',
      startTime: '2026-12-11T08:00:00Z',
      endTime: '2026-12-11T09:30:00Z',
      status: 'ongoing',
      meetingLink: 'https://meet.jit.si/novalearn-sess-002'
    },
    {
      session_id: 'sess-003',
      courseTitle: 'Lập trình React & TypeScript',
      tutorName: 'Lê Văn C',
      tutorAvatar: 'https://example.com/avatar3.jpg',
      startTime: '2026-12-08T14:00:00Z',
      endTime: '2026-12-08T15:30:00Z',
      status: 'completed',
      meetingLink: 'https://meet.jit.si/novalearn-sess-003'
    },
    {
      session_id: 'sess-004',
      courseTitle: 'Tiếng Anh Giao Tiếp IELTS',
      tutorName: 'Phạm Thị D',
      tutorAvatar: 'https://example.com/avatar4.jpg',
      startTime: '2026-12-12T18:00:00Z',
      endTime: '2026-12-12T19:30:00Z',
      status: 'scheduled', // tương đương upcoming
      meetingLink: 'https://meet.jit.si/novalearn-sess-004'
    },
    {
      session_id: 'sess-005',
      courseTitle: 'Hóa Học Hữu Cơ',
      tutorName: 'Hoàng Văn E',
      tutorAvatar: 'https://example.com/avatar5.jpg',
      startTime: '2026-12-05T10:00:00Z',
      endTime: '2026-12-05T11:30:00Z',
      status: 'completed',
      meetingLink: 'https://meet.jit.si/novalearn-sess-005'
    }
  ];

  // =========================================================================
  // Test Case 1: Truyền mảng 5 buổi học ➜ Render ra đúng 5 card buổi học
  // =========================================================================
  describe('Test Case 1: Render danh sách buổi học', () => {
    it('Truyền mảng 5 buổi học ➜ Render ra đúng 5 card buổi học', () => {
      const html = renderToString(
        React.createElement(ScheduleTab, {
          classSessions: mockFiveSessions
        })
      );

      // Đếm số lượng card buổi học được render qua class "schedule-item"
      const itemMatches = html.match(/class="[^"]*schedule-item[^"]*"/g) || [];
      expect(itemMatches.length).toBe(5);

      // Đếm qua thuộc tính data-testid="schedule-card"
      const testidMatches = html.match(/data-testid="schedule-card"/g) || [];
      expect(testidMatches.length).toBe(5);

      // Kiểm tra tiêu đề các khóa học đều xuất hiện trong HTML
      expect(html).toContain('Toán Cao Cấp A1');
      expect(html).toContain('Vật Lý Đại Cương');
      expect(html).toContain('Lập trình React &amp; TypeScript');
      expect(html).toContain('Tiếng Anh Giao Tiếp IELTS');
      expect(html).toContain('Hóa Học Hữu Cơ');
    });

    it('Hiển thị đầy đủ các badge màu: upcoming (Xanh dương), ongoing (Xanh lá), completed (Xám)', () => {
      const html = renderToString(
        React.createElement(ScheduleTab, {
          classSessions: mockFiveSessions
        })
      );

      // Badge upcoming (Xanh dương): class status-badge upcoming
      expect(html).toContain('status-badge upcoming');
      expect(html).toContain('Sắp diễn ra');

      // Badge ongoing (Xanh lá): class status-badge ongoing
      expect(html).toContain('status-badge ongoing');
      expect(html).toContain('Đang học');

      // Badge completed (Xám): class status-badge completed
      expect(html).toContain('status-badge completed');
      expect(html).toContain('Hoàn thành');
    });

    it('Đơn vị kiểm thử helper getStatusBadgeInfo ánh xạ đúng màu sắc & text', () => {
      // upcoming / scheduled ➜ Xanh dương
      expect(getStatusBadgeInfo('upcoming')).toEqual({
        className: 'status-badge upcoming',
        text: 'Sắp diễn ra'
      });
      expect(getStatusBadgeInfo('scheduled')).toEqual({
        className: 'status-badge upcoming',
        text: 'Sắp diễn ra'
      });

      // ongoing ➜ Xanh lá
      expect(getStatusBadgeInfo('ongoing')).toEqual({
        className: 'status-badge ongoing',
        text: 'Đang học'
      });

      // completed ➜ Xám
      expect(getStatusBadgeInfo('completed')).toEqual({
        className: 'status-badge completed',
        text: 'Hoàn thành'
      });

      // cancelled ➜ Đỏ
      expect(getStatusBadgeInfo('cancelled')).toEqual({
        className: 'status-badge cancelled',
        text: 'Đã hủy'
      });
    });
  });

  // =========================================================================
  // Test Case 2: Mảng rỗng ➜ Hiển thị thông báo "Chưa có lịch học nào"
  // =========================================================================
  describe('Test Case 2: Xử lý mảng rỗng và trường hợp không có lịch học', () => {
    it('Mảng rỗng ➜ Hiển thị thông báo "Chưa có lịch học nào"', () => {
      const html = renderToString(
        React.createElement(ScheduleTab, {
          classSessions: []
        })
      );

      // Thông báo rỗng phải hiển thị chính xác
      expect(html).toContain('Chưa có lịch học nào');

      // Không có card buổi học nào được render
      const cardMatches = html.match(/data-testid="schedule-card"/g) || [];
      expect(cardMatches.length).toBe(0);
    });

    it('Khi classSessions là undefined hoặc null ➜ Vẫn an toàn hiển thị "Chưa có lịch học nào"', () => {
      const htmlUndefined = renderToString(
        React.createElement(ScheduleTab, {
          classSessions: undefined as unknown as ClassSession[]
        })
      );
      expect(htmlUndefined).toContain('Chưa có lịch học nào');

      const htmlNull = renderToString(
        React.createElement(ScheduleTab, {
          classSessions: null as unknown as ClassSession[]
        })
      );
      expect(htmlNull).toContain('Chưa có lịch học nào');
    });
  });
});
