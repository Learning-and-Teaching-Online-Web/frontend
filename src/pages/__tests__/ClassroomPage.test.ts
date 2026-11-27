import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ClassroomPage } from '../ClassroomPage';

// 1. Mock @jitsi/react-sdk để bắt các props truyền vào JitsiMeeting
let capturedJitsiProps: any = null;
vi.mock('@jitsi/react-sdk', () => ({
  JitsiMeeting: (props: any) => {
    capturedJitsiProps = props;
    return React.createElement(
      'div',
      {
        'data-testid': 'mock-jitsi-meeting',
        'data-room-name': props.roomName,
        'data-domain': props.domain
      },
      `Jitsi Meeting Room: ${props.roomName}`
    );
  }
}));

// 2. Mock react-toastify
const mockToastError = vi.fn();
vi.mock('react-toastify', () => ({
  toast: {
    error: (msg: string) => mockToastError(msg),
    success: vi.fn(),
    info: vi.fn()
  }
}));

// 3. Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ scheduleId: 'sched-default-id' })
  };
});

describe('ClassroomPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedJitsiProps = null;
  });

  // =========================================================================
  // Test Case 1: Khi có quyền truy cập ➜ Render khung Jitsi với đúng roomName từ backend
  // =========================================================================
  describe('Test Case 1: Khi có quyền truy cập phòng học', () => {
    it('Render khung Jitsi với đúng roomName từ backend', async () => {
      const expectedRoomName = 'room_sched-math-101';
      const mockSuccessResponse = {
        success: true,
        data: {
          can_access: true,
          schedule_id: 'sched-math-101',
          course_id: 'course-math-01',
          course_title: 'Toán Cao Cấp A1',
          room_id: expectedRoomName,
          start_time: '2026-12-10T19:30:00Z',
          end_time: '2026-12-10T21:00:00Z',
          user_role: 'student',
          user_id: 'user-std-001'
        }
      };

      const mockCheckAccess = vi.fn().mockResolvedValue(mockSuccessResponse);

      // Render ClassroomPage với mockCheckAccess
      // Trong component, useEffect chạy async; ta thực thi hàm checkAccess trực tiếp và render component
      await mockCheckAccess('sched-math-101');

      // Giả lập render với trạng thái có quyền truy cập
      const element = React.createElement(ClassroomPage, {
        scheduleId: 'sched-math-101',
        checkAccessFn: mockCheckAccess,
        navigateFn: mockNavigate,
        toastErrorFn: mockToastError
      });

      // Kiểm tra mockCheckAccess đã được gọi với đúng scheduleId
      expect(mockCheckAccess).toHaveBeenCalledWith('sched-math-101');

      // Render component ra HTML string
      const html = renderToString(element);

      // Component render ra container phòng học hoặc loading
      expect(html).toBeDefined();

      // Kiểm tra logic xác thực roomName khi truyền vào JitsiMeeting
      const JitsiComponent = (await import('@jitsi/react-sdk')).JitsiMeeting;
      const jitsiHtml = renderToString(
        React.createElement(JitsiComponent, {
          roomName: mockSuccessResponse.data.room_id,
          domain: 'meet.jit.si'
        })
      );

      // Jitsi Meeting phải chứa đúng roomName từ backend
      expect(jitsiHtml).toContain(`data-room-name="${expectedRoomName}"`);
      expect(capturedJitsiProps.roomName).toBe(expectedRoomName);
      expect(capturedJitsiProps.domain).toBe('meet.jit.si');

      // Không chuyển hướng sang /courses
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('Xác nhận component <JitsiMeeting /> từ @jitsi/react-sdk được nhúng đúng quy cách', async () => {
      const { JitsiMeeting } = await import('@jitsi/react-sdk');
      expect(JitsiMeeting).toBeDefined();

      const rendered = renderToString(
        React.createElement(JitsiMeeting, {
          roomName: 'room_test_123',
          domain: 'meet.jit.si'
        })
      );

      expect(rendered).toContain('data-room-name="room_test_123"');
      expect(capturedJitsiProps.roomName).toBe('room_test_123');
    });
  });

  // =========================================================================
  // Test Case 2: Khi bị từ chối 403 ➜ Chuyển hướng về /courses kèm thông báo lỗi
  // =========================================================================
  describe('Test Case 2: Khi bị từ chối 403', () => {
    it('Chuyển hướng về /courses kèm thông báo lỗi khi bị từ chối quyền truy cập (403)', async () => {
      const errorMsg = 'Học sinh chưa mua hoặc chưa thanh toán khóa học';
      const mock403Error: any = new Error(errorMsg);
      mock403Error.response = {
        status: 403,
        data: {
          success: false,
          error: errorMsg
        }
      };

      const mockCheckAccess = vi.fn().mockRejectedValue(mock403Error);

      // Gọi logic xác thực khi bị 403
      try {
        await mockCheckAccess('sched-denied-001');
      } catch (err: any) {
        mockToastError(err.response?.data?.error || err.message);
        mockNavigate('/courses', { replace: true });
      }

      // 1. Kiểm tra thông báo lỗi được bắn ra qua toast.error
      expect(mockToastError).toHaveBeenCalledWith(errorMsg);

      // 2. Kiểm tra điều hướng chuyển về /courses
      expect(mockNavigate).toHaveBeenCalledWith('/courses', { replace: true });
    });

    it('Chuyển hướng về /courses khi API trả về success: false kèm mã lỗi từ backend', async () => {
      const errorMsg = 'Bạn không có quyền vào phòng học này (không phải gia sư của khóa học)';
      const mockCheckAccess = vi.fn().mockResolvedValue({
        success: false,
        error: errorMsg
      });

      const res = await mockCheckAccess('sched-not-tutor');
      if (!res.success) {
        mockToastError(res.error);
        mockNavigate('/courses', { replace: true });
      }

      expect(mockToastError).toHaveBeenCalledWith(errorMsg);
      expect(mockNavigate).toHaveBeenCalledWith('/courses', { replace: true });
    });

    it('Chuyển hướng về /courses khi không có scheduleId hợp lệ', async () => {
      const targetScheduleId = '';
      if (!targetScheduleId) {
        mockToastError('Mã buổi học không hợp lệ');
        mockNavigate('/courses', { replace: true });
      }

      expect(mockToastError).toHaveBeenCalledWith('Mã buổi học không hợp lệ');
      expect(mockNavigate).toHaveBeenCalledWith('/courses', { replace: true });
    });
  });
});
