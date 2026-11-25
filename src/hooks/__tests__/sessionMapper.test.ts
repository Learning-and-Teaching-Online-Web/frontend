import { describe, it, expect } from 'vitest';
import { mapScheduleToDisplayItem, type RawSchedule } from '../sessionMapper';
import { mapScheduleToDisplayItem as mapFromDashboard } from '../useStudentDashboard';

describe('sessionMapper - mapScheduleToDisplayItem', () => {
  // =========================================================================
  // Test Case 1: Nhận object schedule từ backend ➜ Trả về item có format
  // ngày giờ tiếng Việt "Thứ Hai, 10/12/2026 (19:30 - 21:00)"
  // =========================================================================
  describe('Test Case 1: Format ngày giờ tiếng Việt chuẩn', () => {
    it('Nhận object schedule từ backend ➜ Trả về item có format ngày giờ tiếng Việt "Thứ Hai, 10/12/2026 (19:30 - 21:00)"', () => {
      const mockSchedule: RawSchedule = {
        schedule_id: 'sched-be-001',
        course_id: 'course-web-01',
        session_number: 1,
        start_time: '2026-12-10T19:30:00',
        end_time: '2026-12-10T21:00:00',
        day_of_week: 'Thứ Hai',
        status: 'scheduled',
        course: {
          title: 'Lập trình React & TypeScript thực chiến',
          type: 'online',
          tutor: {
            user: {
              full_name: 'Nguyễn Văn A',
              avatar_url: 'https://example.com/avatar.jpg'
            }
          }
        },
        meetingLink: 'https://meet.jit.si/novalearn-sched-001'
      };

      const result = mapScheduleToDisplayItem(mockSchedule);

      // Kiểm tra chuỗi định dạng hiển thị ngày giờ tiếng Việt
      expect(result.displayTime).toBe('Thứ Hai, 10/12/2026 (19:30 - 21:00)');
      expect(result.formattedTime).toBe('Thứ Hai, 10/12/2026 (19:30 - 21:00)');
      expect(result.formattedSchedule).toBe('Thứ Hai, 10/12/2026 (19:30 - 21:00)');
      expect(String(result)).toBe('Thứ Hai, 10/12/2026 (19:30 - 21:00)');

      // Kiểm tra các trường chi tiết đã bóc tách
      expect(result.dayOfWeek).toBe('Thứ Hai');
      expect(result.date).toBe('10/12/2026');
      expect(result.timeRange).toBe('19:30 - 21:00');
      expect(result.hasValidTime).toBe(true);
      expect(result.courseTitle).toBe('Lập trình React & TypeScript thực chiến');
      expect(result.tutorName).toBe('Nguyễn Văn A');
      expect(result.meetingLink).toBe('https://meet.jit.si/novalearn-sched-001');
    });

    it('Hoạt động đồng bộ khi import từ useStudentDashboard', () => {
      const mockSchedule: RawSchedule = {
        schedule_id: 'sched-be-002',
        start_time: '2026-12-10T19:30:00',
        end_time: '2026-12-10T21:00:00',
        day_of_week: 'Thứ Hai'
      };

      const result = mapFromDashboard(mockSchedule);
      expect(result.displayTime).toBe('Thứ Hai, 10/12/2026 (19:30 - 21:00)');
    });

    it('Tự động suy luận thứ trong tuần từ Date khi day_of_week không truyền vào', () => {
      // 2026-10-12 là Thứ Hai thực tế trên lịch
      const mockSchedule: RawSchedule = {
        schedule_id: 'sched-be-003',
        start_time: '2026-10-12T19:30:00',
        end_time: '2026-10-12T21:00:00'
      };

      const result = mapScheduleToDisplayItem(mockSchedule);
      expect(result.dayOfWeek).toBe('Thứ Hai');
      expect(result.date).toBe('12/10/2026');
      expect(result.timeRange).toBe('19:30 - 21:00');
      expect(result.displayTime).toBe('Thứ Hai, 12/10/2026 (19:30 - 21:00)');
    });

    it('Hỗ trợ map day_of_week dạng số hoặc chuỗi tiếng Anh viết tắt (mon, tue, 1...)', () => {
      const scheduleMon: RawSchedule = {
        start_time: '2026-12-10T19:30:00',
        end_time: '2026-12-10T21:00:00',
        day_of_week: 'mon'
      };
      expect(mapScheduleToDisplayItem(scheduleMon).dayOfWeek).toBe('Thứ Hai');

      const scheduleThu2: RawSchedule = {
        start_time: '2026-12-10T19:30:00',
        end_time: '2026-12-10T21:00:00',
        day_of_week: 'thứ 2'
      };
      expect(mapScheduleToDisplayItem(scheduleThu2).dayOfWeek).toBe('Thứ Hai');

      const scheduleNum1: RawSchedule = {
        start_time: '2026-12-10T19:30:00',
        end_time: '2026-12-10T21:00:00',
        day_of_week: 1
      };
      expect(mapScheduleToDisplayItem(scheduleNum1).dayOfWeek).toBe('Thứ Hai');
    });

    it('Hiển thị chỉ giờ bắt đầu nếu end_time không có hoặc không hợp lệ', () => {
      const scheduleOnlyStart: RawSchedule = {
        start_time: '2026-12-10T19:30:00',
        day_of_week: 'Thứ Hai'
      };

      const result = mapScheduleToDisplayItem(scheduleOnlyStart);
      expect(result.displayTime).toBe('Thứ Hai, 10/12/2026 (19:30)');
    });
  });

  // =========================================================================
  // Test Case 2: Nhận schedule thiếu start_time ➜ Trả về giá trị fallback
  // an toàn, không bị vỡ giao diện
  // =========================================================================
  describe('Test Case 2: Xử lý fallback an toàn khi thiếu start_time', () => {
    it('Thiếu start_time (start_time không có trong object)', () => {
      const scheduleNoStart: RawSchedule = {
        schedule_id: 'sched-missing-start',
        course: {
          title: 'Khóa học chưa xếp lịch'
        }
      };

      const result = mapScheduleToDisplayItem(scheduleNoStart);

      expect(result).toBeDefined();
      expect(result.hasValidTime).toBe(false);
      expect(result.displayTime).toBe('Chưa có lịch');
      expect(result.formattedTime).toBe('Chưa có lịch');
      expect(result.timeRange).toBe('Chưa có thời gian');
      expect(result.dayOfWeek).toBe('Chưa xác định');
      expect(result.date).toBe('Chưa xác định');
      expect(result.courseTitle).toBe('Khóa học chưa xếp lịch');
      expect(result.startTime).toBe('');
      expect(result.endTime).toBe('');
      // Đảm bảo ép kiểu chuỗi không vỡ giao diện
      expect(String(result)).toBe('Chưa có lịch');
    });

    it('start_time là null hoặc undefined hoặc chuỗi rỗng', () => {
      const scheduleNull = mapScheduleToDisplayItem({
        schedule_id: 'sched-null',
        start_time: null
      });
      expect(scheduleNull.hasValidTime).toBe(false);
      expect(scheduleNull.displayTime).toBe('Chưa có lịch');

      const scheduleUndefined = mapScheduleToDisplayItem({
        schedule_id: 'sched-undef',
        start_time: undefined
      });
      expect(scheduleUndefined.hasValidTime).toBe(false);
      expect(scheduleUndefined.displayTime).toBe('Chưa có lịch');

      const scheduleEmptyStr = mapScheduleToDisplayItem({
        schedule_id: 'sched-empty',
        start_time: ''
      });
      expect(scheduleEmptyStr.hasValidTime).toBe(false);
      expect(scheduleEmptyStr.displayTime).toBe('Chưa có lịch');
    });

    it('start_time là định dạng ngày không hợp lệ (Invalid Date)', () => {
      const scheduleInvalid = mapScheduleToDisplayItem({
        schedule_id: 'sched-invalid',
        start_time: 'not-a-valid-date-string'
      });

      expect(scheduleInvalid.hasValidTime).toBe(false);
      expect(scheduleInvalid.displayTime).toBe('Chưa có lịch');
      expect(scheduleInvalid.startTime).toBe('');
    });

    it('schedule truyền vào là null, undefined hoặc object rỗng', () => {
      const fromNull = mapScheduleToDisplayItem(null);
      expect(fromNull.hasValidTime).toBe(false);
      expect(fromNull.displayTime).toBe('Chưa có lịch');
      expect(fromNull.courseTitle).toBe('Khóa học');
      expect(fromNull.tutorName).toBe('Chưa phân công');

      const fromUndefined = mapScheduleToDisplayItem(undefined);
      expect(fromUndefined.hasValidTime).toBe(false);
      expect(fromUndefined.displayTime).toBe('Chưa có lịch');

      const fromEmpty = mapScheduleToDisplayItem({});
      expect(fromEmpty.hasValidTime).toBe(false);
      expect(fromEmpty.displayTime).toBe('Chưa có lịch');
    });
  });
});
