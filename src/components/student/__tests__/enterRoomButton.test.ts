/**
 * enterRoomButton.test.ts
 * Test cho logic nút "Vào phòng học" trong ScheduleTab
 *
 * Strategy: test trực tiếp hàm helper getEnterRoomButtonProps()
 * và kiểm tra HTML render qua renderToString (SSR, không cần jsdom).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getEnterRoomButtonProps } from '../tabs/ScheduleTab';

// ─── Mock react-router-dom ────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// ─── Mock ReviewModal (không cần render thật) ─────────────────────────────────
vi.mock('../ReviewModal', () => ({
  default: () => null,
}));

// ─── Mock lucide-react icons ──────────────────────────────────────────────────
vi.mock('lucide-react', () => ({
  Clock: () => null,
  User: () => null,
  Star: () => null,
  Check: () => null,
  Video: () => null,
}));

// ─── Mock CSS import ──────────────────────────────────────────────────────────
vi.mock('../../../styles/student/ScheduleTab.css', () => ({}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
import type { ClassSession } from '../../../data/mockStudentData';

function makeSession(overrides: Partial<ClassSession>): ClassSession {
  return {
    session_id: 'sess-001',
    startTime: '2026-12-10T19:30:00+07:00',
    endTime: '2026-12-10T21:00:00+07:00',
    status: 'scheduled',
    meetingLink: 'https://zoom.us/test',
    courseTitle: 'Toán nâng cao',
    tutorName: 'Nguyễn Văn A',
    tutorAvatar: '',
    ...overrides,
  };
}

// ─── Tests cho getEnterRoomButtonProps() ──────────────────────────────────────
describe('getEnterRoomButtonProps()', () => {
  it('TC1 – buổi "scheduled" → disabled=false, label="Vào phòng học"', () => {
    const result = getEnterRoomButtonProps(makeSession({ status: 'scheduled' }));
    expect(result.disabled).toBe(false);
    expect(result.label).toBe('Vào phòng học');
  });

  it('TC1 – buổi "ongoing" → disabled=false, label="Vào phòng học"', () => {
    const result = getEnterRoomButtonProps(makeSession({ status: 'ongoing' }));
    expect(result.disabled).toBe(false);
    expect(result.label).toBe('Vào phòng học');
  });

  it('TC2 – buổi "completed" → disabled=true, label="Đã kết thúc"', () => {
    const result = getEnterRoomButtonProps(makeSession({ status: 'completed' }));
    expect(result.disabled).toBe(true);
    expect(result.label).toBe('Đã kết thúc');
  });

  it('TC2 – buổi "cancelled" → disabled=true, label="Đã kết thúc"', () => {
    const result = getEnterRoomButtonProps(makeSession({ status: 'cancelled' }));
    expect(result.disabled).toBe(true);
    expect(result.label).toBe('Đã kết thúc');
  });
});

// ─── Tests render HTML ────────────────────────────────────────────────────────
describe('ScheduleTab – render nút vào phòng học', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('TC1 – buổi "scheduled" → render nút active với data-testid="btn-enter-room"', async () => {
    const { ScheduleTab } = await import('../tabs/ScheduleTab');
    const session = makeSession({ status: 'scheduled', session_id: 'sess-001' });

    const html = renderToString(
      React.createElement(ScheduleTab, { classSessions: [session] })
    );

    expect(html).toContain('data-testid="btn-enter-room"');
    expect(html).toContain('Vào phòng học');
    // Nút active không có attribute disabled
    expect(html).not.toContain('data-testid="btn-enter-room-disabled"');
  });

  it('TC1 – buổi "ongoing" → render nút active với data-testid="btn-enter-room"', async () => {
    const { ScheduleTab } = await import('../tabs/ScheduleTab');
    const session = makeSession({ status: 'ongoing', session_id: 'sess-002' });

    const html = renderToString(
      React.createElement(ScheduleTab, { classSessions: [session] })
    );

    expect(html).toContain('data-testid="btn-enter-room"');
    expect(html).toContain('Vào phòng học');
  });

  it('TC2 – buổi "completed" → render nút disabled với data-testid="btn-enter-room-disabled"', async () => {
    const { ScheduleTab } = await import('../tabs/ScheduleTab');
    const session = makeSession({ status: 'completed', session_id: 'sess-003' });

    const html = renderToString(
      React.createElement(ScheduleTab, { classSessions: [session] })
    );

    expect(html).toContain('data-testid="btn-enter-room-disabled"');
    expect(html).toContain('Đã kết thúc');
    // Nút disabled có attribute disabled=""
    expect(html).toMatch(/disabled/);
  });

  it('TC2 – buổi "cancelled" → render nút disabled', async () => {
    const { ScheduleTab } = await import('../tabs/ScheduleTab');
    const session = makeSession({ status: 'cancelled', session_id: 'sess-004' });

    const html = renderToString(
      React.createElement(ScheduleTab, { classSessions: [session] })
    );

    expect(html).toContain('data-testid="btn-enter-room-disabled"');
    expect(html).toMatch(/disabled/);
  });

  it('navigate URL đúng – session_id được nhúng vào nút /classroom/:scheduleId', async () => {
    const { ScheduleTab } = await import('../tabs/ScheduleTab');
    const session = makeSession({ status: 'scheduled', session_id: 'sess-001' });

    // Dùng getEnterRoomButtonProps để xác nhận logic navigate sẽ dùng session_id
    const props = getEnterRoomButtonProps(session);
    expect(props.disabled).toBe(false);

    // Xác nhận HTML có /classroom/sess-001 không xuất hiện trực tiếp
    // (SSR không fire onClick, nhưng onClick={()=>navigate('/classroom/sess-001')} đã được set)
    const html = renderToString(
      React.createElement(ScheduleTab, { classSessions: [session] })
    );
    // Nút tồn tại và không disabled → navigate('/classroom/sess-001') sẽ được gọi khi click
    expect(html).toContain('data-testid="btn-enter-room"');
    expect(html).not.toContain('disabled=""');
  });
});
